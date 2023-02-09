process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require(`${__dirname}/../api-backend/server`);
const should = chai.should();
let token;

chai.use(chaiHttp);


describe('Import/Export dummy-data endpoints', () => {
    const supAdmin = {
        username: 'TheUltraSuperAdmin',
        password: 'the-password-is-secret',
        usermod: 'super-admin'
    };


    describe('Test for exportData function', () => {
        describe('Login as super-admin to have access to these endpoints', () => {
            it('it should login as super-admin', (done) => {
                const req = supAdmin;
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

        describe('Export data to the database', () => {
            it(`it should export the documents from the database to ${__dirname}\\..\\data\\test\\export\\`, (done) => {
                const req = { username: supAdmin.username, body: { prefix_id: '' } };
                console.log('req:', req);
                chai
                    .request(server)
                    .get('/intelliq_api/dummy-data/export')
                    .set('Cookie', `jwt=${token}`)
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
