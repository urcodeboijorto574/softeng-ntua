/*
 * To run this script, go inside the {root_directory} directory.
 * The format to execute this script is:
 *      node import-data.js [-i | --import] [-d | --delete]
 * 
 * For the command to import data into DB there have to be
 * the following .json files in the data/ folder.
 *      questionnaires.json
 *      questions.json
 *      options.json
 *      sessions.json
 *      answers.json
 * 
 * Be careful. These actions affect the actual DB. This means that if someone's
 * testing the --delete option, everyone will see that DB has no data. If you ever
 * see that the DB is empty, don't worry! Just run this script.
 * Also, DON'T delete files shown above. They are a backup of our DB data.
 */

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Questionnaire = require(`${__dirname}/api-backend/models/questionnaireModel.js`);
const Question = require(`${__dirname}/api-backend/models/questionModel.js`);
const Option = require(`${__dirname}/api-backend/models/optionModel.js`);
const Session = require(`${__dirname}/api-backend/models/sessionModel.js`);
const Answer = require(`${__dirname}/api-backend/models/answerModel.js`);

dotenv.config({ path: `${__dirname}/api-backend/config.env` });

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
        useUnifiedTopology: true /* Only for Ioannis' PC */
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

// Read JSON file
const questionnairesInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/data/questionnaires.json`, 'utf-8'));
const questionsInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/data/questions.json`, 'utf-8'));
const optionsInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/data/options.json`, 'utf-8'));
const sessionsInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/data/sessions.json`, 'utf-8'));
const answersInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/data/answers.json`, 'utf-8'));


/* Import data into Collections */
const importData = async () => {
    try {
        await Questionnaire.create(questionnairesInDataFolder);
        await Question.create(questionsInDataFolder);
        await Option.create(optionsInDataFolder);
        await Session.create(sessionsInDataFolder);
        await Answer.create(answersInDataFolder);

        console.log('Data successfully imported!')
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

/* Delete data from Collections */
const deleteData = async () => {
    try {
        await Questionnaire.deleteMany();
        await Question.deleteMany();
        await Option.deleteMany();
        await Session.deleteMany();
        await Answer.deleteMany();

        console.log('Data successfully \'deleted\'!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

console.log('In data/ directory there are:');
console.log('\tquestionnaires:', questionnairesInDataFolder.length);
console.log('\tquestions:', questionsInDataFolder.length);
console.log('\toptions:', optionsInDataFolder.length);
console.log('\tsessions:', sessionsInDataFolder.length);
console.log('\tanswers:', answersInDataFolder.length);
console.log('\n');

switch (process.argv[2]) {
    case '--import':
    case '-i': importData();
    case '--delete':
    case '-d': deleteData();
    case '--test': console.log('Program successfully tested!'); process.exit();
    default:
        console.log('execution format:\n\tnode import-data.js [-i | --import] [-d | --delete]');
        console.log('You didn\'t specify a parameter, so nothing happend.');
        process.exit(1);
}
