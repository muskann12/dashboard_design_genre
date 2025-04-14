// lib/mongodb.ts
import mongoose, { Connection} from 'mongoose';

interface DatabaseConnection {
  connection: Connection;
  db: mongoose.mongo.Db;
}

export const connectDB = async (): Promise<DatabaseConnection> => {
  // Validate environment variable
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  // Reuse existing connection if available
  if (mongoose.connection.readyState === 1) {
    if (!mongoose.connection.db) {
      throw new Error('Database instance not available on existing connection');
    }
    return {
      connection: mongoose.connection,
      db: mongoose.connection.db
    };
  }

  // Create new connection
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'orderdb',
    retryWrites: true,
    w: 'majority',
    authSource: 'admin',
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000
  });

  // Final verification
  if (!mongoose.connection.db) {
    throw new Error('Connection established but database instance not available');
  }

  console.log('✅ MongoDB Connected');
  return {
    connection: mongoose.connection,
    db: mongoose.connection.db
  };
};