# Google OAuth Setup Guide

This guide explains how to set up Google OAuth authentication for the Expense
Manager API.

## Prerequisites

- A Google Cloud Platform (GCP) account
- The Expense Manager API running locally or deployed

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Expense Manager")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (unless you have a Google Workspace)
3. Click "Create"
4. Fill in the required information:
   - **App name**: Expense Manager
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click "Save and Continue"
6. On the "Scopes" page, click "Add or Remove Scopes"
7. Add the following scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
8. Click "Save and Continue"
9. Add test users if in testing mode
10. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Configure the settings:
   - **Name**: Expense Manager Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for local development)
     - `https://your-api-domain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/v1/auth/google/callback` (for local
       development)
     - `https://your-api-domain.com/api/v1/auth/google/callback` (for
       production)
5. Click "Create"
6. Copy your **Client ID** and **Client Secret**

## Step 5: Configure Environment Variables

Add the following variables to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id-from-step-4
GOOGLE_CLIENT_SECRET=your-client-secret-from-step-4
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:5173

# Session Secret (generate a random string)
SESSION_SECRET=your-random-session-secret
```

## Step 6: Install Dependencies

Run the following command to install the required packages:

```bash
pnpm install
# or
npm install
```

## Step 7: Run Database Migrations

Apply the OAuth schema changes:

```bash
pnpm prisma:migrate
# or
npx prisma migrate dev
```

## Step 8: Test the Integration

### Start the API Server

```bash
pnpm dev
# or
npm run dev
```

### Test OAuth Flow

1. Navigate to: `http://localhost:3000/api/v1/auth/google`
2. You should be redirected to Google's login page
3. Sign in with your Google account
4. Grant permissions
5. You'll be redirected back to your frontend with a JWT token

## API Endpoints

### Initiate Google OAuth

```http
GET /api/v1/auth/google
```

Redirects user to Google's OAuth consent screen.

### OAuth Callback

```http
GET /api/v1/auth/google/callback
```

Handles the OAuth callback from Google. On success, redirects to:

```
{FRONTEND_URL}/auth/callback?token={JWT_TOKEN}
```

On failure, redirects to:

```
{FRONTEND_URL}/auth/error?message=Authentication%20failed
```

## Frontend Integration

### Example React Component

```jsx
const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };

  return <button onClick={handleGoogleLogin}>Continue with Google</button>;
};
```

### Handle OAuth Callback

Create a callback route in your frontend to handle the token:

```jsx
// src/pages/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('message');

    if (token) {
      // Store token
      localStorage.setItem('token', token);

      // Redirect to dashboard
      navigate('/dashboard');
    } else if (error) {
      // Handle error
      console.error('OAuth error:', error);
      navigate('/login?error=' + error);
    }
  }, [searchParams, navigate]);

  return <div>Authenticating...</div>;
};

export default AuthCallback;
```

## Security Considerations

1. **HTTPS in Production**: Always use HTTPS in production
2. **Secure Cookies**: Set `secure: true` for cookies in production
3. **CORS Configuration**: Properly configure CORS origins
4. **Token Storage**: Store JWT tokens securely (HttpOnly cookies recommended
   for production)
5. **Rate Limiting**: Implement rate limiting on OAuth endpoints
6. **Validate Redirects**: Always validate redirect URLs to prevent open
   redirects

## Troubleshooting

### "Redirect URI mismatch" Error

- Ensure the redirect URI in your Google Cloud Console exactly matches the one
  in your `.env` file
- Check for trailing slashes and protocol (http vs https)

### "Access blocked: This app's request is invalid"

- Make sure you've configured the OAuth consent screen
- Verify that the required scopes are added

### User Already Exists Error

- The system automatically links Google accounts to existing email addresses
- If a user registered with email/password, they can still log in with Google
  using the same email

### Session/Cookie Issues

- Clear browser cookies
- Check that `SESSION_SECRET` is set in `.env`
- Verify CORS is properly configured with `credentials: true`

## Production Deployment

For production:

1. Update `GOOGLE_CALLBACK_URL` to use your production domain
2. Update `FRONTEND_URL` to your production frontend URL
3. Add production URLs to Google Cloud Console authorized origins and redirect
   URIs
4. Set `NODE_ENV=production` in your environment
5. Use HTTPS for all URLs
6. Consider using environment-specific credentials

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Google Cloud Console](https://console.cloud.google.com/)
