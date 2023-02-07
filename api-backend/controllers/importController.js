const fs = require('fs');
const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const User = require(`${__dirname}/../models/userModel.js`);
const Models = [Answer, Session, Option, Question, Questionnaire, User];

/**
 * Middleware that imports all the data from the folder data/ to the data base.
 * @param {JSON} req - JSON request object which is not used in this function.
 * @param {JSON} res - JSON response object containing a confirmation/rejection of the request.
 * @param {JSON} next - the next function in the middleware stack.
 * @return {JSON} - The response object.
 * 
 * URL: {baseURL}/dummy-data/import
 */
exports.importData = async (req, res, next) => {
    /* Read JSON files */
    const questionnairesInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/../../data/questionnaires.json`, 'utf-8'));
    const questionsInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/../../data/questions.json`, 'utf-8'));
    const optionsInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/../../data/options.json`, 'utf-8'));
    const sessionsInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/../../data/sessions.json`, 'utf-8'));
    const answersInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/../../data/answers.json`, 'utf-8'));
    const usersInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/../../data/users.json`, 'utf-8'));
    const dataFiles = [
        answersInDataFolder,
        sessionsInDataFolder,
        optionsInDataFolder,
        questionsInDataFolder,
        questionnairesInDataFolder,
        usersInDataFolder
    ];

    /* Check if there are questionnaires to import */
    for (let i = 2; i < 5; ++i) {
        if (!dataFiles[i] || dataFiles[i].length === 0)
            return res.status(402).json({
                status: 'failed',
                message: 'no data to import'
            });
    }

    /* (Optional) Change the prefix of the _id */
    const prefix_id = '';
    dataFiles.forEach(collection => {
        collection.forEach(doc => {
            doc['_id'] = prefix_id.concat(doc['_id'].slice(prefix_id.length));
            let docArray;
            if (doc['questions']) docArray = doc['questions'];
            else if (doc['options']) docArray = doc['options'];
            else if (doc['answers']) docArray = doc['answers'];
            if (docArray)
                docArray.forEach(el => {
                    el['_id'] = prefix_id.concat(el['_id'].slice(prefix_id.length));
                });
        });
    });

    console.log('Data to import:');
    dataFiles.forEach(collection => {
        let doctype;
        if (collection[0]) {
            switch (collection[0]) {
                case dataFiles[0]: doctype = '--------------------------------------------------Answers--------------------------------------------------'; break;
                case dataFiles[1]: doctype = '--------------------------------------------------Sessions--------------------------------------------------'; break;
                case dataFiles[2]: doctype = '--------------------------------------------------Options--------------------------------------------------'; break;
                case dataFiles[3]: doctype = '--------------------------------------------------Questions--------------------------------------------------'; break;
                case dataFiles[4]: doctype = '--------------------------------------------------Questionnaires--------------------------------------------------'; break;
                default: doctype = '--------------------------------------------------Users--------------------------------------------------'; break;
            }
            console.log(doctype); console.log(collection);
        }
    });

    try {
        process.stdout.write('Start importing data');
        const limit = Models.length;
        for (let i = 0; i < limit; ++i) {
            await Models[i].create(dataFiles[i]);
            process.stdout.write(`...${i + 1}/${limit}${i == limit - 1 ? '\n' : ''}`);
        }
        const message = 'Data successfully imported!';
        console.log(message);

        return res.status(200).json({
            status: 'OK',
            message
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err
        });
    }
    next();
};

/**
 * Middleware that exports all the data from the DB.
 * @param {JSON} req - JSON request object which is not used in this function.
 * @param {JSON} res - JSON response object containing a confirmation/rejection of the request.
 * @param {JSON} next - the next function in the middleware stack.
 * @return {JSON} - The response object.
 * 
 * URL: {baseURL}/dummy-data/export
 */
exports.exportData = async (req, res, next) => {
    try {
        console.log('Start exporting data');

        for (let i = 0, limit = Models.length; i < limit; ++i) {
            const dataDeleted = await Models[i]
                .deleteMany()
                .where('_id')
                .gte('                        '); // this string must have length 24 (if for _id)
            console.log('Deleted data:', dataDeleted);
            process.stdout.write(`...${i + 1}/${limit}${i == limit - 1 ? '\n' : ''}`);
        }

        const message = 'Data successfully deleted!';
        console.log(message);

        return res.status(402).json({
            status: 'OK',
            message
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: error
        });
    }
    next();
};
