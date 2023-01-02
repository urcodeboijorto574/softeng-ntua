const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });

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
    })
    .then(() => {
        //console.log(con.connections);
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

// save the server
const server = app.listen(port, () => {
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
