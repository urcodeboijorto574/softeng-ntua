process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require(`${__dirname}/../api-backend/server`);
const should = chai.should();
let token;

chai.use(chaiHttp);


describe('Import/Export dummy-data endpoints', () => {
    const superAdmin = {
        username: 'TheUltraSuperAdmin',
        password: 'the-password-is-secret',
        usermod: 'super-admin'
    };

    describe('Test for importData function', () => {
        describe('Login as super-admin to have access to these endpoints', () => {
            it('it should login as super-admin', (done) => {
                const req = superAdmin;
                chai
                    .request(server)
                    .post('/intelliq_api/login')
                    .set('Cookie', `jwt=${token}`)
                    .send(req)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('token');
                        token = res.body.token;
                        done();
                    })
                    .timeout(1000000);
            });
        });


        describe('--- Normal case', () => {
            it(`it should respond with status code 200 and a message \'Documents imported successfully.\'`, (done) => {
                const body = { prefixId: '' };
                chai
                    .request(server)
                    .post('/intelliq_api/dummy-data/import')
                    .set('Cookie', `jwt=${token}`)
                    .send(body)
                    .end((err, res) => {
                        res.body.message.should.equal('Documents imported successfully.');
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('OK');
                        res.body.should.have.property('message');
                        done();
                    })
                    .timeout(1000000);
            });
        });

        describe('--- Error in given prefixId', () => {
            describe('prefixId is longer than 24 characters', () => {
                it('it should respond with code 400 and an error message \'prefixId can\'t be more than 24 characters long\'', (done) => {
                    const body = { prefixId: '1244567890124456789012445' };
                    chai
                        .request(server)
                        .get('/intelliq_api/dummy-data/export')
                        .set('Cookie', `jwt=${token}`)
                        .send(body)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('status');
                            res.body.status.should.equal('failed');
                            res.body.should.have.property('message');
                            res.body.message.should.equal('prefixId can\'t be more than 24 characters long');
                            done();
                        })
                        .timeout(1000000);
                });
            });

            describe('prefixId is not a hexademical number', () => {
                it('it should respond with code 400 and an error message \'prefixId must be a hexademical number\'', (done) => {
                    let body = { prefixId: 'my_prefixId_is_NaN' };
                    chai
                        .request(server)
                        .get('/intelliq_api/dummy-data/export')
                        .set('Cookie', `jwt=${token}`)
                        .send(body)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('status');
                            res.body.status.should.equal('failed');
                            res.body.should.have.property('message');
                            res.body.message.should.equal('prefixId must be a hexademical number');
                            done();
                        })
                        .timeout(1000000);
                });
            });
        });


        describe('Logout', () => {
            it('it should logout the currently logged-in super-admin', (done) => {
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

    describe('Test for exportData function', () => {
        describe('Login as super-admin to have access to these endpoints', () => {
            it('it should login as super-admin', (done) => {
                const body = superAdmin;
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


        describe('--- Normal case', () => {
            it(`it should respond with status code 200 and a message \'Documents exported successfully.\'`, (done) => {
                const body = { prefixId: '00' };
                chai
                    .request(server)
                    .get('/intelliq_api/dummy-data/export')
                    .set('Cookie', `jwt=${token}`)
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        res.body.status.should.equal('OK');
                        res.body.should.have.property('message');
                        res.body.message.should.equal('Documents exported successfully.');
                        done();
                    })
                    .timeout(1000000);
            });
        });

        describe('--- Error in given prefixId', () => {
            describe('prefixId is longer than 24 characters', () => {
                it('it should respond with code 400 and an error message \'prefixId can\'t be more than 24 characters long\'', (done) => {
                    const body = { prefixId: '1244567890124456789012345' };
                    chai
                        .request(server)
                        .get('/intelliq_api/dummy-data/export')
                        .set('Cookie', `jwt=${token}`)
                        .send(body)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('status');
                            res.body.status.should.equal('failed');
                            res.body.should.have.property('message');
                            res.body.message.should.equal('prefixId can\'t be more than 24 characters long');
                            done();
                        })
                        .timeout(1000000);
                });
            });

            describe('prefixId is not a hexademical number', () => {
                it('it should respond with code 400 and an error message \'prefixId must be a hexademical number\'', (done) => {
                    let body = { prefixId: 'my_prefixId_is_NaN' };
                    chai
                        .request(server)
                        .get('/intelliq_api/dummy-data/export')
                        .set('Cookie', `jwt=${token}`)
                        .send(body)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('status');
                            res.body.status.should.equal('failed');
                            res.body.should.have.property('message');
                            res.body.message.should.equal('prefixId must be a hexademical number');
                            done();
                        })
                        .timeout(1000000);
                });
            });
        });


        describe('Logout', () => {
            it('it should logout the currently logged-in super-admin', (done) => {
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
