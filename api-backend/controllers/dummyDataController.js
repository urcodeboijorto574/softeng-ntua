const mongoose = require('mongoose');
const fs = require('fs');
const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const User = require(`${__dirname}/../models/userModel.js`);
const Models = [Option, Question, Questionnaire, Answer, Session, User];
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
    try {
        /* Read JSON files */
        const prefix = `${__dirname}\\..\\..\\data\\test\\import\\`, postfix = '.json';
        const sourceFiles = ['options', 'questions', 'questionnaires', 'answers', 'sessions', 'users'].map(str => prefix + str + postfix);
        let collectionsFiles = [];
        for (let i = 0, limit = sourceFiles.length; i < limit; ++i) {
            collectionsFiles.push(JSON.parse(fs.readFileSync(sourceFiles[i], 'utf-8')));
        }

        /* (Optional) Change the prefixes of the '_id's of all the documents read from the file system */
        const prefixId = ((req.body != undefined) && (req.body.prefixId != undefined)) ? req.body.prefixId : '';
        const prefixId_tooLong = prefixId.length > 24;
        if (prefixId_tooLong) throw { myMessage: 'prefixId can\'t be more than 24 characters long' };
        const is_NaN16 = prefixId.split('').some(digit => {
            let charCode = digit.charCodeAt(0);
            let inRange = (l, h) => ((charCode >= l.charCodeAt(0)) && (charCode <= h.charCodeAt(0)));
            return !(inRange('0', '9') || inRange('a', 'f') || inRange('A', 'F'));
        });
        if (is_NaN16) throw { myMessage: 'prefixId must be a hexademical number' };

        if (prefixId !== '') {
            for (let i = 0; i < collectionsFiles.length; ++i) {
                for (let j = 0; j < collectionsFiles[i].length; ++j) {
                    collectionsFiles[i][j]._id = { $oid: prefixId.concat(collectionsFiles[i][j]._id.slice(prefixId.length)) };
                    if (collectionsFiles[i][j].questions != undefined) {
                        for (let k = 0; k < collectionsFiles[i][j].questions.length; ++k) {
                            collectionsFiles[i][j].questions.splice(k, 1, { $oid: mongoose.Types.ObjectId(prefixId.concat(collectionsFiles[i][j].questions[k].slice(prefixId.length))) });
                        }
                    } else if (collectionsFiles[i][j].options != undefined) {
                        for (let k = 0; k < collectionsFiles[i][j].options.length; ++k) {
                            collectionsFiles[i][j].options.splice(k, 1, { $oid: mongoose.Types.ObjectId(prefixId.concat(collectionsFiles[i][j].options[k].slice(prefixId.length))) });
                        }
                    } else if (collectionsFiles[i][j].answers != undefined) {
                        for (let k = 0; k < collectionsFiles[i][j].answers.length; ++k) {
                            collectionsFiles[i][j].answers.splice(k, 1, { $oid: mongoose.Types.ObjectId(prefixId.concat(collectionsFiles[i][j].answers[k].slice(prefixId.length))) });
                        }
                    } else if (collectionsFiles[i][j].questionnairesAnswered != undefined) {
                        for (let k = 0; k < collectionsFiles[i][j].questionnairesAnswered.length; ++k) {
                            collectionsFiles[i][j].questionnairesAnswered.splice(k, 1, { $oid: mongoose.Types.ObjectId(prefixId.concat(collectionsFiles[i][j].questionnairesAnswered[k].slice(prefixId.length))) });
                        }
                    }
                }
            }
        }

        /* Create the documents in the DB */
        // for (let i = 0, limit = collectionsFiles.length; i < limit; ++i) {
        //     if (i == 0) {
        //         console.log(collectionsFiles[i][0]);
        //         collectionsFiles[i][0].optionID
        //         const [result] = await Promise.allSettled([Models[i].create(collectionsFiles[i][0])]);
        //         if (result.status === 'rejected') {
        //             console.log(result);
        //             return handleResponse(req, res, 400, {
        //                 status: 'failed',
        //                 message: 'Assertion error caught'
        //             });
        //         }
        //     }
        // }
        collectionsFiles[4][0].sessionID = 'impT';
        collectionsFiles[4][0].answers = [];
        collectionsFiles[4][0].submitter = 'john-user';
        let resultArr = await Promise.allSettled([
            Session.create(collectionsFiles[4][0])
            // Models[0].create(collectionsFiles[0]),
            // Models[1].create(collectionsFiles[1]),
            // Models[2].create(collectionsFiles[2]),
            // Models[3].create(collectionsFiles[3]),
            // Models[4].create(collectionsFiles[4]),
            // Models[5].create(collectionsFiles[5])
        ]);
        for (let i = 0; i < resultArr.length; ++i) {
            if (resultArr[i].status === 'rejected') {
                console.log(resultArr[i]);
                return handleResponse(req, res, 500, {
                    status: 'failed',
                    message: 'Assertion error caught'
                });
            }
        }

        /* Return response */
        return handleResponse(req, res, 200, {
            status: 'OK',
            message: 'Documents imported successfully.'
        });

    } catch (error) {
        const myMessageExists = error.myMessage != undefined;
        return handleResponse(req, res, myMessageExists ? 400 : 500, {
            status: 'failed',
            message: myMessageExists ? error.myMessage : error
        });
    }
    next();
};

/**
 * Middleware that exports all the data from the DB. A prefixId can be given in req.body,
 * which will be the prefix of the _id of every document saved in the file system. Also, the postfix of the name of the file will be this prefixId.
 * @param {JSON} req - JSON request object containing a prefixId in req.body.
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
        const prefixId = ((req.body != undefined) && (req.body.prefixId != undefined)) ? req.body.prefixId : '';

        const prefixId_tooLong = prefixId.length > 24;
        if (prefixId_tooLong)
            throw { myMessage: 'prefixId can\'t be more than 24 characters long' };

        const is_NaN = prefixId.split('').some(digit => {
            let charCode = digit.charCodeAt(0);
            let inRange = (l, h) => ((charCode >= l.charCodeAt(0)) && (charCode <= h.charCodeAt(0)));
            return !(inRange('0', '9') || inRange('a', 'f') || inRange('A', 'F'));
        });
        if (is_NaN)
            throw { myMessage: 'prefixId must be a hexademical number' };

        if (prefixId !== '') {
            collectionsDB.forEach(collection => {
                collection.forEach(doc => {
                    doc._id = mongoose.Types.ObjectId(prefixId.concat(doc._id.toString().slice(prefixId.length)));
                    if (doc.questions != undefined) {
                        doc.questions = doc.questions.map(el => mongoose.Types.ObjectId(prefixId.concat(el.toString().slice(prefixId.length))));
                    } else if (doc.options != undefined) {
                        doc.options = doc.options.map(el => mongoose.Types.ObjectId(prefixId.concat(el.toString().slice(prefixId.length))));
                    } else if (doc.answers != undefined) {
                        doc.answers = doc.answers.map(el => mongoose.Types.ObjectId(prefixId.concat(el.toString().slice(prefixId.length))));
                    } else if (doc.questionnairesAnswered != undefined) {
                        doc.questionnairesAnswered = doc.questionnairesAnswered.map(el => mongoose.Types.ObjectId(prefixId.concat(el.toString().slice(prefixId.length))));
                    }
                });
            });
        }


        /* Write the data into the files */
        let prefix = `${__dirname}\\..\\..\\data\\test\\export\\`, postfix = '.json';
        const targetFiles = ['answers', 'sessions', 'options', 'questions', 'questionnaires', 'users'].map(str => prefix + str + postfix);

        for (let i = 0, preLen = prefix.length; i < collectionsDB.length; ++i) {
            fs.writeFileSync(targetFiles[i], JSON.stringify(collectionsDB[i]), { flag: 'w' });
        }

        /* Return response */
        return handleResponse(req, res, 200, {
            status: 'OK',
            message: 'Documents exported successfully.'
        });
    } catch (error) {
        const myMessageExists = error.myMessage != undefined;
        console.log(`myMessageExists: ${myMessageExists}`);
        return handleResponse(req, res, myMessageExists ? 400 : 500, {
            status: 'failed',
            message: myMessageExists ? error.myMessage : error
        });
    }
    next();
};
