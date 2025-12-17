import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './database.js';
import logger from './logger.js';
import { createDefaultCategories } from '../utils/defaultCategories.js';

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/v1/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user information from Google profile
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;
        const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

        // Check if user exists with this Google ID
        let user = await prisma.user.findUnique({
          where: { googleId }
        });

        if (user) {
          // User exists, update their information if needed
          user = await prisma.user.update({
            where: { googleId },
            data: {
              name,
              avatar,
              updatedAt: new Date()
            },
            select: {
              id: true,
              email: true,
              name: true,
              avatar: true,
              authProvider: true,
              createdAt: true
            }
          });

          logger.info('User logged in with Google', { userId: user.id, email });
          return done(null, user);
        }

        // Check if user exists with this email (from local registration)
        const existingUser = await prisma.user.findUnique({
          where: { email }
        });

        if (existingUser) {
          // Link Google account to existing user
          user = await prisma.user.update({
            where: { email },
            data: {
              googleId,
              avatar: avatar || existingUser.avatar,
              authProvider: 'google',
              updatedAt: new Date()
            },
            select: {
              id: true,
              email: true,
              name: true,
              avatar: true,
              authProvider: true,
              createdAt: true
            }
          });

          logger.info('Google account linked to existing user', { userId: user.id, email });
          return done(null, user);
        }

        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            name,
            googleId,
            avatar,
            authProvider: 'google',
            password: null // No password for OAuth users
          },
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            authProvider: true,
            createdAt: true
          }
        });

        // Create default categories for new user
        await createDefaultCategories(user.id);

        logger.info('New user created with Google', { userId: user.id, email });
        return done(null, user);
      } catch (error) {
        logger.error('Error occurred', { service: process.env.APP_NAME, environment: process.env.NODE_ENV, stack: error.stack, context: 'google-oauth' });
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        authProvider: true,
        createdAt: true
      }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
