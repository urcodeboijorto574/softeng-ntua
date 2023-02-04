process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../api-backend/server');
const should = chai.should();
let token;

chai.use(chaiHttp);

describe('Answer endpoints', () => {
    describe('Accessed by users:', () => {
        describe('/login', () => {
            it('it should login a user to have access to the endpoints', (done) => {
                const user = {
                    username: 'user-vass',
                    password: 'test1234',
                };
                chai
                    .request(server)
                    .post('/intelliq_api/login')
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
