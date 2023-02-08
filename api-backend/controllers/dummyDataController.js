const mongoose = require('mongoose');
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
    const collectionsFiles = [
        answersInDataFolder,
        sessionsInDataFolder,
        optionsInDataFolder,
        questionsInDataFolder,
        questionnairesInDataFolder,
        usersInDataFolder
    ];

    /* Check if there are questionnaires to import */
    for (let i = 2; i < 5; ++i) {
        if (!collectionsFiles[i] || collectionsFiles[i].length === 0)
            return res.status(402).json({
                status: 'failed',
                message: 'no data to import'
            });
    }

    /* (Optional) Change the prefix of the _id */
    const prefix_id = '00';
    collectionsFiles.forEach(collection => {
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
    collectionsFiles.forEach(collection => {
        let doctype;
        if (collection[0]) {
            switch (collection[0]) {
                case collectionsFiles[0]: doctype = '--------------------------------------------------Answers--------------------------------------------------'; break;
                case collectionsFiles[1]: doctype = '--------------------------------------------------Sessions--------------------------------------------------'; break;
                case collectionsFiles[2]: doctype = '--------------------------------------------------Options--------------------------------------------------'; break;
                case collectionsFiles[3]: doctype = '--------------------------------------------------Questions--------------------------------------------------'; break;
                case collectionsFiles[4]: doctype = '--------------------------------------------------Questionnaires--------------------------------------------------'; break;
                default: doctype = '--------------------------------------------------Users--------------------------------------------------'; break;
            }
            console.log(doctype); console.log(collection);
        }
    });

    try {
        process.stdout.write('Start importing data');
        const limit = Models.length;
        for (let i = 0; i < limit; ++i) {
            await Models[i].create(collectionsFiles[i]);
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
        let questionnairesInDB, questionsInDB, optionsInDB, sessionsInDB, answersInDB, usersInDB;

        /* Read data from DB */
        questionnairesInDB = await Questionnaire.find();
        const questionnairesFound = questionnairesInDB != 0;
        questionsInDB = questionnairesFound ? await Question.find() : [];
        optionsInDB = questionnairesFound ? await Option.find() : [];
        sessionsInDB = questionnairesFound ? await Session.find() : [];
        answersInDB = sessionsInDB != 0 ? await Answer.find() : [];
        usersInDB = await User.find();
        let collectionsDB = [answersInDB, sessionsInDB, optionsInDB, questionsInDB, questionnairesInDB, usersInDB];

        /* (Optional) Change the prefixes of the '_id's of all the documents in DB */
        const prefix_id = '';
        if (prefix_id !== '') {
            collectionsDB.forEach(collection => {
                collection.forEach(doc => {
                    doc._id = mongoose.Types.ObjectId(prefix_id.concat(doc._id.toString().slice(prefix_id.length)));
                    if (doc.questions != undefined) {
                        doc.questions = doc.questions.map(el => mongoose.Types.ObjectId(prefix_id.concat(el.toString().slice(prefix_id.length))));
                    } else if (doc.options != undefined) {
                        doc.options = doc.options.map(el => mongoose.Types.ObjectId(prefix_id.concat(el.toString().slice(prefix_id.length))));
                    } else if (doc.answers != undefined) {
                        doc.answers = doc.answers.map(el => mongoose.Types.ObjectId(prefix_id.concat(el.toString().slice(prefix_id.length))));
                    } else if (doc.questionnairesAnswered != undefined) {
                        doc.questionnairesAnswered = doc.questionnairesAnswered.map(el => mongoose.Types.ObjectId(prefix_id.concat(el.toString().slice(prefix_id.length))));
                    }
                });
            });
        }

        /* Write the data into the files */
        let prefix = `${__dirname}/../../data/test/`, postfix = '.json'; // this can't change for the time being
        const targetFiles = ['answers', 'sessions', 'options', 'questions', 'questionnaires', 'users'].map(str => prefix + str + postfix);
        let dataExported = [false, false, false, false, false, false];

        let accMsg = '';
        try {
            for (let i = 0, preLen = prefix.length; i < collectionsDB.length; ++i) {
                if (i > 0) accMsg += (i == 1 ? '' : ', ') + targetFiles[i - 1].slice(preLen);
                fs.writeFileSync(targetFiles[i], JSON.stringify(collectionsDB[i]));
                dataExported[i] = true;
                if (i == targetFiles.length - 1) accMsg += ', ' + targetFiles[targetFiles.length - 1].slice(preLen);
            }
        } catch (error) {
            console.log((accMsg === '' ? 'No' : accMsg) + ' files saved successfully. The rest didn\'t.');
            return res.status(500).json({
                status: 'failed',
                message: 'error in writing files'
            });
        }

        /* Return response */
        console.log(accMsg + ' files saved successfully.');
        const success = dataExported.reduce((prev, curr) => prev & curr, true);
        let message = success ? 'Documents exported successfully.' : 'Export failed.';
        return res.status(success ? 200 : 400).json({
            status: success ? 'OK' : 'failed',
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
