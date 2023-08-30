import 'dotenv/config';
import { app } from './app';
import { testDBConnection } from './db';
import https from 'https';
import http from 'http';
import { readFile } from 'fs/promises';
import { join } from 'path';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const certLocation = process.env.CERT_LOCATION ?? join(__dirname, '..');

const main = async () => {
  const dbError = await testDBConnection();

  if (dbError) {
    console.error("Can't connect to the DB");
    console.error(dbError);
    return;
  }

  try {
    const cert = await readFile(join(certLocation, 'cert.pem'), { encoding: 'utf8' });
    const key = await readFile(join(certLocation, 'key.pem'), { encoding: 'utf8' });

    https.createServer({ cert, key }, app).listen(port, () => {
      console.log(`HTTPS Server running on port ${port}`);
    });

    http.createServer(app).listen(port + 1, () => {
      console.log(`HTTP Server running on port ${port + 1}`);
    });
  } catch (e) {
    console.error(e);
  }
};

main();
