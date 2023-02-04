const mongoose = require('mongoose');
const dotenv = require('dotenv');
const https = require('https');
const fs = require('fs');

const key = fs.readFileSync(`${__dirname}/HTTPS-SSL/key.pem`).toString();
const cert = fs.readFileSync(`${__dirname}/HTTPS-SSL/cert.pem`).toString();

dotenv.config({ path: './config.env' });
const app = require('./app');


// DB is the database connection string
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

// Connect to DB
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB connection succesful!');
    })
    .catch((err) => {
        console.log(err.name, err.message);
        console.log('Error! Could not connect to DB');
        server.close(() => {
            process.exit(1);
        });
    });

const port = process.env.PORT || 3000;

// http server (just for testing)
/* const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
}); */

//-----------------------------------------------------------------------//

// https server
const server = https
    .createServer({ key: key, cert: cert }, app)
    .listen(port, () => {
        console.log(`App running on port ${port}...`);
    });

// αυτος ο listener χειριζεται τα error Που δεν γινονται, δλδ τα promise rejections.
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});

module.exports = server;
