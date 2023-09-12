import 'dotenv/config';
import { app } from './app';
import { testDBConnection } from './db';
import { connectToRedis } from './redis';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const main = async () => {
  const dbError = await testDBConnection();

  if (dbError) {
    console.error("Can't connect to the DB");
    console.error(dbError);
    return;
  }

  await connectToRedis();

  app.listen(port, () => {
    console.log(`HTTP Server running on port ${port}`);
  });
};

main();
