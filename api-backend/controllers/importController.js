const fs = require('fs');
const mongoose = require('mongoose');
const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const Models = [Answer, Session, Option, Question, Questionnaire];

exports.importData = async (req, res, next) => {
    /* Read JSON files */
    const questionnairesInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/../../data/questionnaires.json`, 'utf-8'));
    const questionsInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/../../data/questions.json`, 'utf-8'));
    const optionsInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/../../data/options.json`, 'utf-8'));
    const sessionsInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/../../data/sessions.json`, 'utf-8'));
    const answersInDataFolder = JSON.parse(fs.readFileSync(`${__dirname}/../../data/answers.json`, 'utf-8'));
    const dataFiles = [answersInDataFolder, sessionsInDataFolder, optionsInDataFolder, questionsInDataFolder, questionnairesInDataFolder];

    try {
        /* Check if there are questionnaires to import */
        for (let i = 2; i < 5; ++i)
            if (!dataFiles[i] || dataFiles[i].length === 0)
                return res.status(402).json({
                    status: 'failed',
                    message: 'no data to import'
                });

        /* A modification must occur, because the files contain the IDs wrong (kinda) */
        dataFiles.forEach(collection => {
            collection.forEach(doc => {
                let idStr = doc._id.$oid;
                /* With this line the _id of this document can change (in the stage of "tmod[0]='0';") */
                // let tmod = idStr.split(''); tmod[0] = '0'; idStr = tmod.join('');
                delete doc._id;
                const newObjId = mongoose.Types.ObjectId(idStr);
                doc['_id'] = newObjId;
            });
        });


        console.log('Data to import:');
        for (let i = 0; i < 5; ++i)
            console.log(dataFiles[i]);

        /* Import the data in DB */
        process.stdout.write('Start importing data');
        for (let i = 0; i < 5; ++i) {
            // await Models[i].create(dataFiles[i]);
            process.stdout.write(`...${i + 1}/5${i == 4 ? '\n' : ''}`);
        }

        const msg = 'Data successfully imported!';
        console.log(msg);

        return res.status(200).json({
            status: 'success',
            msg
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            reason: err.name,
            details: err.message
        });
    }
    next();
};

exports.deleteData = async (req, res, next) => {
    try {
        console.log('Start deleting data');

        for (let i = 0; i < 5; ++i) {
            // await Models[i].deleteMany();
            process.stdout.write(`...${i + 1}/5${i == 4 ? '\n' : ''}`);
        }
        const msg = 'Data successfully deleted!';
        console.log(msg);

        return res.status(402).json({
            status: 'success',
            msg
        })
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            reason: err.name,
            details: err.message
        });
    }
    next();
};
