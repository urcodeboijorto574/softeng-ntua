const mongoose = require('mongoose');
const fs = require('fs');
const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const User = require(`${__dirname}/../models/userModel.js`);
const Models = [Answer, Session, Option, Question, Questionnaire, User];
const handleResponse = require(`${__dirname}/../utils/handleResponse.js`).handleResponse;

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
    let questionnairesInFiles, questionsInFiles, optionsInFiles, sessionsInFiles, answersInFiles, usersInFiles,
        collectionsFiles;
    try {
        questionnairesInFiles = JSON.parse(fs.readFileSync(`${__dirname}/../../data/questionnaires.json`, 'utf-8'));
        questionsInFiles = JSON.parse(fs.readFileSync(`${__dirname}/../../data/questions.json`, 'utf-8'));
        optionsInFiles = JSON.parse(fs.readFileSync(`${__dirname}/../../data/options.json`, 'utf-8'));
        sessionsInFiles = JSON.parse(fs.readFileSync(`${__dirname}/../../data/sessions.json`, 'utf-8'));
        answersInFiles = JSON.parse(fs.readFileSync(`${__dirname}/../../data/answers.json`, 'utf-8'));
        usersInFiles = JSON.parse(fs.readFileSync(`${__dirname}/../../data/users.json`, 'utf-8'));
        collectionsFiles = [answersInFiles, sessionsInFiles, optionsInFiles, questionsInFiles, questionnairesInFiles, usersInFiles];
    } catch (error) {
        console.log('Error while reading files');
        return handleResponse(req, res, 500, {
            status: 'failed',
            message: error
        });
    }

    /* (Optional) Change the prefixes of the '_id's of all the documents in DB */
    const prefix_id = (req.body.prefix_id != undefined ? req.body.prefix_id : '');
    if (prefix_id !== '') {
        collectionsFiles.forEach(collection => {
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

    /* Create the documents in the DB */
    try {
        const limit = Models.length;
        for (let i = 0; i < limit; ++i) {
            await Models[i].create(collectionsFiles[i]);
            process.stdout.write(`...${i + 1}/${limit}${i == limit - 1 ? '\n' : ''}`);
        }

        /* Return response */
        const message = 'Documents imported successfully!';
        console.log(message);
        return handleResponse(req, res, 200, {
            status: 'OK',
            message,
            // data: {
            //     answers: collectionsFiles[0],
            //     sessions: collectionsFiles[1],
            //     options: collectionsFiles[2],
            //     questions: collectionsFiles[3],
            //     questionnaires: collectionsFiles[4],
            //     users: collectionsFiles[5]
            // }
        });
    } catch (error) {
        return handleResponse(req, res, 500, {
            status: 'failed',
            message: error
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
        /* Read data from DB */
        let questionnairesInDB, questionsInDB, optionsInDB, sessionsInDB, answersInDB, usersInDB;
        questionnairesInDB = await Questionnaire.find();
        const questionnairesFound = questionnairesInDB != 0;
        questionsInDB = questionnairesFound ? await Question.find() : [];
        optionsInDB = questionnairesFound ? await Option.find() : [];
        sessionsInDB = questionnairesFound ? await Session.find() : [];
        answersInDB = sessionsInDB != 0 ? await Answer.find() : [];
        usersInDB = await User.find();
        let collectionsDB = [answersInDB, sessionsInDB, optionsInDB, questionsInDB, questionnairesInDB, usersInDB];

        /* (Optional) Change the prefixes of the '_id's of all the documents in DB */
        const prefix_id = (req.body && req.body.prefix_id != undefined ? req.body.prefix_id : '');
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
        let prefix = `${__dirname}/../../data/`, postfix = '.json'; // this can't change for the time being
        const targetFiles = ['answers', 'sessions', 'options', 'questions', 'questionnaires', 'users'].map(str => prefix + str + postfix);
        let dataExported = [false, false, false, false, false, false];

        let accMsg = '';
        try {
            for (let i = 0, preLen = prefix.length; i < collectionsDB.length; ++i) {
                fs.writeFileSync(targetFiles[i], JSON.stringify(collectionsDB[i]));
                dataExported[i] = true;
                accMsg += (!i ? '' : ', ') + targetFiles[i].slice(preLen);
            }
        } catch (error) {
            console.log((accMsg === '' ? 'No' : accMsg) + ' files saved successfully. The rest didn\'t.');
            return handleResponse(req, res, 500, {
                status: 'failed',
                message: 'error in writing files'
            });
        }

        /* Return response */
        console.log(accMsg + ' files saved successfully.');
        const success = dataExported.reduce((prev, curr) => prev & curr, true);
        let message = success ? 'Documents exported successfully.' : 'Export failed.';
        return handleResponse(req, res, success ? 200 : 400, {
            status: success ? 'OK' : 'failed',
            message
        });
    } catch (error) {
        return handleResponse(req, res, 500, {
            status: 'failed',
            message: error
        });
    }
    next();
};
