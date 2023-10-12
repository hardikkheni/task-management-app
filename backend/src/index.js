const path = require('path');
require('dotenv').config({
  path: path.resolve(process.cwd(), `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`),
});
const { connect } = require('./db');
const app = require('./app');

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await connect();
  } catch (err) {
    console.log('============================================');
    console.log('Error connecting to database: ', err.message, err);
    console.log('============================================');
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log('============================================');
    console.log(`Server up & running on port(${PORT}).`);
    console.log('============================================');
  });
}

bootstrap();

async function graceful() {
  process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
