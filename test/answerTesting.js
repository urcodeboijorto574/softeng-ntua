process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require(`${__dirname}/../api-backend/server`);
const should = chai.should();
let token;

chai.use(chaiHttp);


describe('Doanswer endpoint', () => {
    const superAdmin = {
        username: 'TheUltraSuperAdmin',
        password: 'the-password-is-secret',
        usermod: 'super-admin'
    };
    const myTestAdmin = {
        username: 'my-test-admin',
        password: 'test1234',
        usermod: 'admin'
    };
    const myTestUser = {
        username: 'my-test-user',
        password: 'test1234',
        usermod: 'user'
    };
    const correctArgs = {
        questionnaireID: 'myQue',
        questionID: 'QJ0',
        session: 'myS1',
        optionID: 'PJ0TXT'
    };

    describe('Create dummy questionnaire for testing', () => {

        describe('Sign up as a new admin (my-test-admin)', () => {
            it('it should create a new admin with username "my-test-admin"', (done) => {
                chai
                    .request(server)
                    .post('/intelliq_api/signup')
                    .send(myTestAdmin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('OK');
                        done();
                    })
                    .timeout(1000000);
            });
        });

        describe('Login (my-test-admin)', () => {
            it('it should login as "my-test-admin"', (done) => {
                const body = {
                    username: myTestAdmin.username,
                    password: myTestAdmin.password
                };
                chai
                    .request(server)
                    .post('/intelliq_api/login')
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('token');
                        token = res.body.token;
                        done();
                    })
                    .timeout(1000000);
            });
        });

        describe('Create a new questionnaire with questionnaireID \'myQue\'', () => {
            it('it should create a new (dummy) questionnaire with questionnaireID "myQue"', (done) => {
                chai
                    .request(server)
                    .post('/intelliq_api/admin/questionnaire_upd')
                    .set("Cookie", `jwt=${token}`)
                    .attach('file', `${__dirname}/../api-backend/files/questionnaire_to_test_doanswer.txt`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('OK');
                        done();
                    })
                    .timeout(1000000);
            });
        });

        describe('Logout (my-test-admin)', () => {
            it('it should logout the logged-in admin (my-test-admin)', (done) => {
                chai
                    .request(server)
                    .post("/intelliq_api/logout")
                    .set("Cookie", `jwt=${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property("status");
                        res.body.status.should.equal("OK");
                        res.body.should.have.property("message");
                        res.body.message.should.equal("You are successfully logged out.");
                        token = " ";
                        done();
                    })
                    .timeout(1000000);
            });
        });

    });

    describe('Begin testing process', () => {
        describe('Sign up as a new user (my-test-user)', () => {
            it('it should create a new user with username "my-test-user"', (done) => {
                chai
                    .request(server)
                    .post('/intelliq_api/signup')
                    .send(myTestUser)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('OK');
                        done();
                    })
                    .timeout(1000000);
            });
        });

        describe('Login (my-test-user)', () => {
            it('it should login as "my-test-user"', (done) => {
                const body = {
                    username: myTestUser.username,
                    password: myTestUser.password
                };
                chai
                    .request(server)
                    .post('/intelliq_api/login')
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('token');
                        token = res.body.token;
                        done();
                    })
                    .timeout(1000000);
            });
        });

        describe('Actual doanswer testing', () => {
            const URLprefix = '/intelliq_api/doanswer';
            let URLparams, URL;
            const correctArgs = {
                questionnaireID: 'myQue',
                questionID: 'QJ0',
                session: 'myS1',
                optionID: 'PJ0TXT'
            };

            describe('Normal case for doanswer endpoint', () => {
                describe('Answer first question (text)', () => {
                    it('it should create an answer for a specific questionnaire\'s question and a session (one does not already exist)', (done) => {
                        URLparams = '/' + correctArgs.questionnaireID + '/' + correctArgs.questionID + '/' + correctArgs.session + '/' + correctArgs.optionID;
                        URL = URLprefix + URLparams;
                        let body = { answertext: 'YELLOW' };

                        chai
                            .request(server)
                            .post(URL)
                            .set('Cookie', `jwt=${token}`)
                            .send(body)
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
                describe('Answer second question (select option)', () => {
                    it('it should create an answer for a specific questionnaire\'s question (a session already exists)', (done) => {
                        URLparams = '/' + correctArgs.questionnaireID + '/' + 'QJ1' + '/' + correctArgs.session + '/' + 'PJ1A0';
                        URL = URLprefix + URLparams;
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
                describe('Answer last question (select option)', () => {
                    it('it should create an answer for a specific questionnaire\'s question (a session already exists)', (done) => {
                        URLparams = '/' + correctArgs.questionnaireID + '/' + 'QJ2' + '/' + correctArgs.session + '/' + 'PJ2A0';
                        URL = URLprefix + URLparams;
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
            });

            describe('Bad scenario 1: Parameters given are invalid', () => {
                const body = { answertext: 'GREEN' };
                describe('questionnaireID is invalid', () => {
                    it('it should respond with status code 400', (done) => {
                        URLparams = '/' + 'QQwrg' + '/' + correctArgs.questionID + '/' + correctArgs.session + '/' + correctArgs.optionID;
                        URL = URLprefix + URLparams;

                        chai
                            .request(server)
                            .post(URL)
                            .set('Cookie', `jwt=${token}`)
                            .send(body)
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
                        URLparams = '/' + correctArgs.questionnaireID + '/' + 'Qno' + '/' + correctArgs.session + '/' + correctArgs.optionID;
                        URL = URLprefix + URLparams;

                        chai
                            .request(server)
                            .post(URL)
                            .set('Cookie', `jwt=${token}`)
                            .send(body)
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
                        URLparams = '/' + correctArgs.questionnaireID + '/' + correctArgs.questionID + '/' + correctArgs.session + '/' + 'Pwrng';
                        URL = URLprefix + URLparams;

                        chai
                            .request(server)
                            .post(URL)
                            .set('Cookie', `jwt=${token}`)
                            .send(body)
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
                    const URLparams = '/' + correctArgs.questionnaireID + '/' + correctArgs.questionID + '/' + 'myS2' + '/' + correctArgs.optionID;
                    const URL = URLprefix + URLparams;
                    const body = { answertext: 'red' };
                    chai
                        .request(server)
                        .post(URL)
                        .set('Cookie', `jwt=${token}`)
                        .send(body)
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
        });

        describe('Logout (my-test-user)', () => {
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

        describe('Bad scenario 3: Another answer has already been submitted in current session', () => {
            describe('First, this questionnaire\'s previously submitted session will be deleted', () => {
                const body = { answertext: '' };
                describe('Login (super-admin)', () => {
                    it('it should login the super-admin to have access to the endpoints', (done) => {
                        chai
                            .request(server)
                            .post('/intelliq_api/login')
                            .send(superAdmin)
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
                        const URLparams = '/' + correctArgs.questionnaireID;
                        const URL = '/intelliq_api/admin/resetq' + URLparams;
                        chai
                            .request(server)
                            .post(URL)
                            .set('Cookie', `jwt=${token}`)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.have.property('status');
                                res.body.status.should.equal('OK');
                                done();
                            })
                            .timeout(1000000);
                    });
                });
                describe('Logout (super-admin)', () => {
                    it('it should logout the logged-in super-admin', (done) => {
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
                describe('Login (my-test-user)', () => {
                    it('it should login the user that is going to answer the questionnaire', (done) => {
                        const body = {
                            username: myTestUser.username,
                            password: myTestUser.password
                        };
                        chai
                            .request(server)
                            .post('/intelliq_api/login')
                            .set('Cookie', `jwt=${token}`)
                            .send(body)
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
                        const URLparams = '/' + correctArgs.questionnaireID + '/' + correctArgs.questionID + '/' + correctArgs.session + '/' + correctArgs.optionID;
                        const URL = '/intelliq_api/doanswer' + URLparams;
                        const body = { answertext: 'RED' };
                        chai
                            .request(server)
                            .post(URL)
                            .set('Cookie', `jwt=${token}`)
                            .send(body)
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
                        const URLparams = '/' + correctArgs.questionnaireID + '/' + correctArgs.questionID + '/' + correctArgs.session + '/' + correctArgs.optionID;
                        const URL = '/intelliq_api/doanswer' + URLparams;
                        const body = { answertext: 'BLACK' };
                        chai
                            .request(server)
                            .post(URL)
                            .set('Cookie', `jwt=${token}`)
                            .send(body)
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
                describe('Logout (my-test-user)', () => {
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

    describe('Delete all dummy data used for this testing', () => {
        describe('Login (super-admin)', () => {
            it('it should login the super-admin to have access to the endpoints', (done) => {
                const body = {
                    username: superAdmin.username,
                    password: superAdmin.password
                };
                chai
                    .request(server)
                    .post('/intelliq_api/login')
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('token');
                        token = res.body.token;
                        done();
                    })
                    .timeout(1000000);
            });
        });

        describe('Delete my-test-admin and my-test-user profiles', () => {
            it('it should respond with status code 200 and "status: \'OK\'"', (done) => {
                const URL = `/intelliq_api/admin/users/deleteUser/${myTestAdmin.username}`;
                chai
                    .request(server)
                    .delete(URL)
                    .set('Cookie', `jwt=${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('OK');
                        done();
                    })
                    .timeout(1000000);
            });

            it('it should respond with status code 200 and "status: \'OK\'"', (done) => {
                const URL = `/intelliq_api/admin/users/deleteUser/${myTestUser.username}`;
                chai
                    .request(server)
                    .delete(URL)
                    .set('Cookie', `jwt=${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('OK');
                        done();
                    })
                    .timeout(1000000);
            });
        });

        describe('Delete dummy questionnaire\'s sessions', () => {
            it('it should respond with status code 200 and "status: \'OK\'"', (done) => {
                const URL = '/intelliq_api/admin/resetq/' + correctArgs.questionnaireID;
                chai
                    .request(server)
                    .post(URL)
                    .set('Cookie', `jwt=${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('OK');
                        done();
                    })
                    .timeout(1000000);
            });
        });

        describe('Delete dummy questionnaire', () => {
            it('it should respond with status code 200 and "status: \'OK\'"', (done) => {
                const URL = '/intelliq_api/questionnaire/deletequestionnaire/' + correctArgs.questionnaireID;
                chai
                    .request(server)
                    .delete(URL)
                    .set('Cookie', `jwt=${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('OK');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('Questionnaire and related documents deleted successfully');
                        done();
                    })
                    .timeout(1000000);
            });
        });

        describe('Logout (super-admin)', () => {
            it('it should logout the logged-in super-admin', (done) => {
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
