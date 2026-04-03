import 'dotenv/config';
import { connectDatabase } from './config/db.js';
import { createApp } from './app.js';

const app = createApp();
const port = Number(process.env.PORT || 5000);

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`${process.env.APP_NAME || 'Student Manager'} backend running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
