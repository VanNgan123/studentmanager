import mongoose from 'mongoose';

export async function connectDatabase() {
  const databaseUrl = process.env.DB_URL;

  if (!databaseUrl) {
    throw new Error('DB_URL is not defined');
  }

  await mongoose.connect(databaseUrl);
}
