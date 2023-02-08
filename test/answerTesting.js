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
                /* This will be commented until resetq endpoint is 100% working */
                chai
                    .request(server)
                    .post('/intelliq_api/admin/resetq/' + req.params.questionnaireID)
                    .set('Cookie', `jwt=${token}`)
                    .send(req)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('OK');
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
        usermod: 'user'
    };
    describe('/login', () => {
        it('it should login a user to have access to the endpoints', (done) => {
            chai
                .request(server)
                .post('/intelliq_api/login')
                .set('Cookie', `jwt=${token}`)
                .send(user)
                // .send({ username: 'john-user', password: '0123456789' })
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
                req.questionID = 'QJ1', req.optionID = 'PJ1A0';
                URLparams = '/' + questionnaireID + '/' + req.questionID + '/' + session + '/' + req.optionID;
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
                req.questionnaireID = 'QQwrg';

                URLparams = '/' + req.questionnaireID + '/' + questionID + '/' + session + '/' + optionID;
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
                req.questionID = 'Qno';

                URLparams = '/' + questionnaireID + '/' + req.questionID + '/' + session + '/' + optionID;
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
                req.optionID = 'Pmstk';

                URLparams = '/' + questionnaireID + '/' + questionID + '/' + session + '/' + req.optionID;
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

    describe('Bad scenario 2: The questionnaire has already been answered by the logged-in user', () => {
        it('it should respond with status code 400', (done) => {
            const URLparams = '/' + questionnaireID + '/' + questionID + '/' + session + '/' + optionID;
            const URL = URLprefix + URLparams;
            req.session = 'testO';
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
                    res.body.message.should.equal('You have already submitted a session for this questionnaire');
                    done();
                })
                .timeout(1000000);
        });
    });

    describe('/logout', () => {
        it('it should logout the logged-in user', (done) => {
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

    describe('Bad scenario 3: Another answer has already been submitted', () => {
        describe('First, this questionnaire\'s previously submitted session will be deleted', () => {
            const super_admin = {
                username: 'TheUltraSuperAdmin',
                password: 'the-password-is-secret',
                usermod: 'super-admin'
            };
            req = {
                username: super_admin.username,
                params: {
                    questionnaireID: 'QQ574',
                    questionID: 'QJ0',
                    session: 'testI',
                    optionID: 'PJ0A2'
                },
                body: {
                    answertext: ''
                }
            };
            describe('/login', () => {
                it('it should login the super admin to have access to the endpoints', (done) => {
                    chai
                        .request(server)
                        .post('/intelliq_api/login')
                        .set('Cookie', `jwt=${token}`)
                        .send(super_admin)
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
                it('it should delete the session and answers of a questionnaire that the logged-in user has submitted', (done) => {
                    const URLparams = '/' + req.params.questionnaireID;
                    const URL = '/intelliq_api/admin/resetq' + URLparams;
                    chai
                        .request(server)
                        .post(URL)
                        .set('Cookie', `jwt=${token}`)
                        .send(req)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('status');
                            res.body.status.should.equal('OK');
                            done();
                        })
                        .timeout(1000000);
                });
            });
            describe('/logout', () => {
                it('it should logout the logged-in admin', (done) => {
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
        describe('Now, a new session will be tried to be submitted', () => {
            user.username = 'john-user';
            req.username = user.username;
            req.questionID = 'QJ0';
            req.optionID = 'PJ0A2';
            describe('/login', () => {
                it('it should login the user that is going to answer the questionnaire', (done) => {
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
            describe('/doanswer/:questionnaireID/:questionID/:session/:optionID', () => {
                it('it should submit an answer for a question and return status code 200', (done) => {
                    const URLparams = '/' + questionnaireID + '/' + questionID + '/' + session + '/' + optionID;
                    const URL = URLprefix + URLparams;
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
            describe('/doanswer/:questionnaireID/:questionID/:session/:optionID', () => {
                it('it should reject the submission of the answer at hand and return status code 400', (done) => {
                    const URLparams = '/' + questionnaireID + '/' + questionID + '/' + session + '/' + optionID;
                    const URL = URLprefix + URLparams;
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
                            res.body.message.should.equal('An answer has already been submitted for this question');
                            res.body.should.have.property('previous answer');
                            done();
                        })
                        .timeout(1000000);
                });
            });
            describe('/logout', () => {
                it('it should logout the logged-in admin', (done) => {
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
    });
});

describe('Session\'s Answers endpoint', () => { });

describe('Question\'s Answers endpoint', () => { });
