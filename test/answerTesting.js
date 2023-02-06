process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require(`${__dirname}/../api-backend/server`);
const should = chai.should();
let token;

chai.use(chaiHttp);


describe('Doanswer endpoint', () => {
    describe('Will delete the session with sessionID \'mySes\' just for testing purposes', () => {
        describe('/login', () => {
            it('it should login as super-admin to have access to /intelliq_api/admin/resetq/:questionnaireID endpoint', (done) => {
                chai
                    .request(server)
                    .post('/intelliq_api/login')
                    .set('Cookie', `jwt=${token}`)
                    .send({ username: 'TheUltraSuperAdmin', password: 'the-password-is-secret' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('token');
                        token = res.body.token;
                        done();
                    })
                    .timeout(1000000);
            });
        });
        describe('/admin/resetq/:questionnaireID', () => {
            let req = {
                username: 'TheUltraSuperAdmin',
                params: { questionnaireID: 'QQ574' }
            };
            it('it should delete all the sessions and answers connected to the specified questionnaire, with questionnaireID = \'QQ547\'', (done) => {
                chai
                    .request(server)
                    .post('/intelliq_api/admin/resetq/' + req.params.questionnaireID)
                    .set('Cookie', `jwt=${token}`)
                    .send(req)
                    .end((err, res) => {
                        // res.should.have.status(200);
                        // res.body.should.have.property('status');
                        // res.body.status.should.equal('OK');
                        // res.body.should.have.property('message');
                        // res.body.message.should.equal('');
                        done();
                    })
                    .timeout(1000000);
            });
        });
        describe('/logout', () => {
            it('it should logout the logged in super-admin', (done) => {
                chai
                    .request(server)
                    .post('/intelliq_api/logout')
                    .set('Cookie', `jwt=${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('OK');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('You are successfully logged out.');
                        done();
                    })
                    .timeout(1000000);
            });
        });
    });


    const user = {
        username: 'john-user',
        password: '0123456789',
    };
    describe('/login', () => {
        it('it should login a user to have access to the endpoints', (done) => {
            chai
                .request(server)
                .post('/intelliq_api/login')
                .set('Cookie', `jwt=${token}`)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('token');
                    token = res.body.token;
                    done();
                })
                .timeout(1000000);
        });
    });

    const URLprefix = '/intelliq_api' + '/doanswer';
    let questionnaireID = 'QQ574', questionID = 'QJ0', session = 'mySes', optionID = 'PJ0A0',
        URLparams, URL;
    let req = {
        username: user.username,
        params: {
            questionnaireID,
            questionID,
            session,
            optionID
        }
    };
    describe('Normal case for doanswer endpoint', () => {
        describe('/doanswer/:questionnaireID/:questionID/:session/:optionID (creates new session)', () => {
            it('it should create an answer for a specific questionnaire\'s question and a session (one does not already exist)', (done) => {
                URLparams = '/' + questionnaireID + '/' + questionID + '/' + session + '/' + optionID;
                URL = URLprefix + URLparams;

                chai
                    .request(server)
                    .post(URL)
                    .set('Cookie', `jwt=${token}`)
                    .send(req)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('OK');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('Answer submitted!');
                        done();
                    })
                    .timeout(1000000);
            });
        });
        describe('/doanswer/:questionnaireID/:questionID/:session/:optionID (uses existing session)', () => {
            it('it should create an answer for a specific questionnaire\'s question (a session already exists)', (done) => {
                questionID = 'QJ1', optionID = 'PJ1A0';
                let req = {
                    username: user.username,
                    params: {
                        questionnaireID,
                        questionID,
                        session,
                        optionID
                    }
                };
                URLparams = '/' + questionnaireID + '/' + questionID + '/' + session + '/' + optionID;
                URL = URLprefix + URLparams;
                chai
                    .request(server)
                    .post(URL)
                    .set('Cookie', `jwt=${token}`)
                    .send(req)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('OK');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('Answer submitted!');
                        done();
                    })
                    .timeout(1000000);
            });
        });
    });

    describe('Bad scenario 1: Parameters given are invalid', () => {
        describe('questionnaireID is invalid', () => {
            it('it should respond with status code 400', (done) => {
                req.questionnaireID = questionnaireID = 'QQwrg';

                URLparams = '/' + questionnaireID + '/' + questionID + '/' + session + '/' + optionID;
                URL = URLprefix + URLparams;

                chai
                    .request(server)
                    .post(URL)
                    .set('Cookie', `jwt=${token}`)
                    .send(req)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('failed');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('Arguments provided are invalid');
                        done();
                    })
                    .timeout(1000000);
            });
        });
        describe('questionID is invalid', () => {
            it('it should respond with status code 400', (done) => {
                req.questionID = questionID = 'Qno';

                URLparams = '/' + questionnaireID + '/' + questionID + '/' + session + '/' + optionID;
                URL = URLprefix + URLparams;

                chai
                    .request(server)
                    .post(URL)
                    .set('Cookie', `jwt=${token}`)
                    .send(req)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('failed');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('Arguments provided are invalid');
                        done();
                    })
                    .timeout(1000000);
            });
        });
        describe('optionID is invalid', () => {
            it('it should respond with status code 400', (done) => {
                req.optionID = optionID = 'Pmstk';

                URLparams = '/' + questionnaireID + '/' + questionID + '/' + session + '/' + optionID;
                URL = URLprefix + URLparams;

                chai
                    .request(server)
                    .post(URL)
                    .set('Cookie', `jwt=${token}`)
                    .send(req)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('failed');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('Arguments provided are invalid');
                        done();
                    })
                    .timeout(1000000);
            });
        });
    });

    describe('Bad scenario 2: Another answer has already been submitted', () => {
        console.log('came to bad scenario 2');
    });

    describe('Bad scenario 3: Internal Server Error (triggering: req.params field missing)', () => {

    });

    describe('/logout', () => {
        it('it should logout the logged in admin', (done) => {
            chai
                .request(server)
                .post('/intelliq_api/logout')
                .set('Cookie', `jwt=${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status');
                    res.body.status.should.equal('OK');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('You are successfully logged out.');
                    done();
                })
                .timeout(1000000);
        });
    });
});

describe('Session\'s Answers endpoint', () => {

});

describe('Question\'s Answers endpoint', () => { });
