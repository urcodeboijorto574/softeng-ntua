const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

/* DB is the database connection string */
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

exports.getHealthcheck = (res, req) => {
    mongoose
        .connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        .then(
            () => { /* DB connection check is successful */
                return res.status(200).json({
                    status: 'OK',
                    dbconnection: '<connection string>'
                });
            },
            err => { /* DB connection check failed */
                return res.status(500).json({
                    status: 'failed',
                    dbconnection: '<connection string>'
                });

            });
}
