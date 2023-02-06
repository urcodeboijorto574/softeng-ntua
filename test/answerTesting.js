process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require(`${__dirname}/../api-backend/server`);
const should = chai.should();
let token;

chai.use(chaiHttp);

/*------------------- NORMAL FUNCTION FOR DOANSWER ENDPOINT -------------------*/
describe('Answer endpoints', () => {
    describe('Accessed by users:', () => {
        describe('/login', () => {
            it('it should login a user to have access to the endpoints', (done) => {
                const user = {
                    username: 'john-user',
                    password: '0123456789',
                };
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


        let questionnaireID = 'QQ574', questionID = 'QJ1', optionID = 'PJ1A0', session = 'mySes';
        const URLpath = '/doanswer/' + questionnaireID + questionID + session + optionID;
        const URL = '/intelliq_api' + URLpath;

        describe(URLpath, () => {
            it('it should create an answer for a specific questionnaire\'s question and a session, if one does not already exist', (done) => {
                chai
                    .request(server)
                    .post(URL)
                    .set('Cookie', `jwt=${token}`)
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
});


/*------------------- BAD SCENARIO 1: Username is invalid -------------------*/
describe('Answer endpoints', () => {
    describe('Accessed by users:', () => {
        describe('/login', () => {
            it('it should login a user to have access to the endpoints', (done) => {
                const user = {
                    username: '',
                    password: '0123456789',
                };
                chai
                    .request(server)
                    .post('/intelliq_api/login')
                    .set('Cookie', `jwt=${token}`)
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('token');
                        token = res.body.token;
                        done();
                    })
                    .timeout(1000000);
            });
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
});

/*------------------- BAD SCENARIO 2: Parameters given are invalid -------------------*/
describe('Answer endpoints', () => {
    describe('Accessed by users:', () => {
        describe('/login', () => {
            it('it should login a user to have access to the endpoints', (done) => {
                const user = {
                    username: 'john-user',
                    password: '0123456789',
                };
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

        let URL = '/doanswer/:questionnaireID/:questionID/:session/:optionID';

        /* Invalid questionnaireID */
        describe(URL, () => {
            it('it should give status code 400 and status: \'failed\'', (done) => {
                const req = {
                    username: 'john-user',
                    params: {
                        questionnaireID: 'QQwrg',
                        questionID: 'Qno',
                        session: 'fAlSe',
                        optionID: 'QJnot'
                    }
                };
                chai
                    .request(server)
                    .post('/intelliq_api' + URL)
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
        /* Invalid questionID */
        describe(URL, () => {
            it('it should give status code 400 and status: \'failed\'', (done) => {
                const req = {
                    username: 'john-user',
                    params: {
                        questionnaireID: 'QQ574',
                        questionID: 'Qno',
                        session: 'fAlSe',
                        optionID: 'QJnot'
                    }
                };
                chai
                    .request(server)
                    .post('/intelliq_api' + URL)
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
        /* Invalid optionID */
        describe(URL, () => {
            it('it should give status code 400 and status: \'failed\'', (done) => {
                const req = {
                    username: 'john-user',
                    params: {
                        questionnaireID: 'QQwrg',
                        questionID: 'QJ1',
                        session: 'fAlSe',
                        optionID: 'QJnot'
                    }
                };
                chai
                    .request(server)
                    .post('/intelliq_api' + URL)
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
});

/*------------------- BAD SCENARIO 3: Another answer has already been submitted -------------------*/
describe('Answer endpoints', () => {
    describe('Accessed by users:', () => {
        describe('/login', () => {
            it('it should login a user to have access to the endpoints', (done) => {
                const user = {
                    username: 'john-user',
                    password: '0123456789',
                };
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

        let URL = '/doanswer/:questionnaireID/:questionID/:session/:optionID';
        describe(URL, () => {
            it('it should give status code 400 and status: \'failed\'', (done) => {
                const req = {
                    username: 'john-user',
                    params: {
                        questionnaireID: 'QQ574',
                        questionID: 'QJ1',
                        session: 'uwBR',
                        optionID: 'PJ1A2'
                    }
                };
                chai
                    .request(server)
                    .post('/intelliq_api' + URL)
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
});

/*------------------- BAD SCENARIO 4: Internal Server Error (triggering: req.params field missing) -------------------*/
describe('Answer endpoints', () => {
    describe('Accessed by users:', () => {
        describe('/login', () => {
            it('it should login a user to have access to the endpoints', (done) => {
                const user = {
                    username: 'john-user',
                    password: '0123456789',
                };
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

        let URL = '/doanswer/:questionnaireID/:questionID/:session/:optionID';
        describe(URL, () => {
            it('it should give status code 400 and status: \'failed\'', (done) => {
                const req = {
                    username: 'john-user',
                    params: {}
                };
                chai
                    .request(server)
                    .post('/intelliq_api' + URL)
                    .set('Cookie', `jwt=${token}`)
                    .send(req)
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('failed');
                        res.body.should.have.property('message');
                        done();
                    })
                    .timeout(1000000);
            });
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
});
