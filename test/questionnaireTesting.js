process.env.NODE_ENV = "test";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require(`${__dirname}/../api-backend/server`);
let should = chai.should();
var token;

chai.use(chaiHttp);

describe("Questionnaire endpoints", () => {
  describe("Accessed by users:", () => {
    describe("/login", () => {
      it("it should login a user to have access to the endpoints", (done) => {
        const user = {
          username: "user-vass",
          password: "test1234",
        };
        chai
          .request(server)
          .post("/intelliq_api/login")
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("token");
            token = res.body.token;
            done();
          })
          .timeout(1000000);
      });
    });

    describe("/questionnaire/getuseransweredquestionnaires", () => {
      it("it should return all the questionnaires that have been answered by the logged in user", (done) => {
        chai
          .request(server)
          .get("/intelliq_api/questionnaire/getuseransweredquestionnaires")
          .set("Cookie", `jwt=${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("status");
            res.body.status.should.equal("OK");
            res.body.should.have.property("data");
            res.body.data.should.have.property("questionnaires");
            done();
          })
          .timeout(1000000);
      });
    });

    describe("/questionnaire/getusernotansweredquestionnaires", () => {
      it("it should return all the questionnaires that have not been answered by the logged in user", (done) => {
        chai
          .request(server)
          .get("/intelliq_api/questionnaire/getusernotansweredquestionnaires")
          .set("Cookie", `jwt=${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("status");
            res.body.status.should.equal("success");
            res.body.should.have.property("data");
            done();
          })
          .timeout(1000000);
      });
    });

    describe("/logout", () => {
      it("it should logout the logged in user", (done) => {
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
            done();
          })
          .timeout(1000000);
      });
    });
  });

  describe("Accessed by admins:", () => {
    describe("/login", () => {
      it("it should login an admin to have access to the endpoints", (done) => {
        const user = {
          username: "admin-vass",
          password: "test1234",
        };
        chai
          .request(server)
          .post("/intelliq_api/login")
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("token");
            token = res.body.token;
            done();
          })
          .timeout(1000000);
      });
    });

    describe("/questionnaire/getadmincreatedquestionnaires", () => {
      it("it should return all the questionnaires that have been created by the logged in admin", (done) => {
        chai
          .request(server)
          .get("/intelliq_api/questionnaire/getadmincreatedquestionnaires")
          .set("Cookie", `jwt=${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("status");
            res.body.status.should.equal("OK");
            res.body.should.have.property("data");
            res.body.data.should.have.property("questionnaires");
            done();
          })
          .timeout(1000000);
      });
    });

    describe("/logout", () => {
      it("it should logout the logged in admin", (done) => {
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
            done();
          })
          .timeout(1000000);
      });
    });
  });
});
