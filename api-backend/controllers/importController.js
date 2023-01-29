const fs = require('fs');
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

    /* Check if there are questionnaires to import */
    for (let i = 2; i < 5; ++i) {
        if (!dataFiles[i] || dataFiles[i].length === 0)
            return res.status(402).json({
                status: 'failed',
                message: 'no data to import'
            });
    }

    /* (Optional) Change the prefix of the _id */
    const prefix_id = '0';
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
                default: doctype = '--------------------------------------------------Questionnaires--------------------------------------------------'; break;
            }
            console.log(doctype); console.log(collection);
        }
    });

    try {
        process.stdout.write('Start importing data');
        for (let i = 0; i < 5; ++i) {
            await Models[i].create(dataFiles[i]);
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
            const dataDeleted = await Models[i]
                .deleteMany()
                .where('_id')
                .lte('100000000000000000000000');
            console.log('Deleted data:', dataDeleted);
            process.stdout.write(`...${i + 1}/5${i == 4 ? '\n' : ''}`);
        }

        const msg = 'Data successfully deleted!';
        console.log(msg);

        return res.status(402).json({
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
