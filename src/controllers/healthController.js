import prisma from '../config/database.js';

export const getHealth = async (req, res) => {
  try {
    const healthCheck = {
      status: 'ok',
      message: 'Expenser API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };

    res.json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Service unavailable',
      timestamp: new Date().toISOString()
    });
  }
};

export const getHealthDetailed = async (req, res) => {
  try {
    // Check database connectivity
    let databaseStatus = 'connected';
    let databaseMessage = 'Database is operational';

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      databaseStatus = 'disconnected';
      databaseMessage = 'Database connection failed';
    }

    const healthCheck = {
      status: databaseStatus === 'connected' ? 'ok' : 'degraded',
      message: 'Expenser API Health Check',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: databaseStatus,
          message: databaseMessage
        },
        api: {
          status: 'ok',
          message: 'API is operational'
        }
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        memory: {
          used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
          total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
          unit: 'MB'
        }
      }
    };

    const statusCode = databaseStatus === 'connected' ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Service unavailable',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};
