process.env.NODE_ENV = "test";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../api-backend/server");
let should = chai.should();
var token;

chai.use(chaiHttp);

describe("Questionnaire endpoints", () => {
  describe("Accessed by users:", () => {
    describe("/login", () => {
      it("it should login a user to have access to the endpoints", (done) => {
        const user = {
          username: "test-user1",
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
            res.body.should.have.property("status");
            res.body.should.have.property("data");
            res.body.data.should.have.property("answeredQuestionnaires");
            if (res.body.data.answeredQuestionnaires.length == 0) {
              res.should.have.status(402);
              res.body.status.should.equal("no data");
            } else {
              res.should.have.status(200);
              res.body.status.should.equal("OK");
            }
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
            res.body.should.have.property("status");
            res.body.should.have.property("data");
            res.body.data.should.have.property("notAnsweredQuestionnaires");
            if (res.body.data.notAnsweredQuestionnaires.length == 0) {
              res.should.have.status(402);
              res.body.status.should.equal("no data");
            } else {
              res.should.have.status(200);
              res.body.status.should.equal("OK");
            }
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
    describe("/signup", () => {
      it("it should create a new admin to use in the testing", (done) => {
        const newUser = {
          username: "test-admin1",
          password: "test1234",
          usermod: "admin",
        };
        chai
          .request(server)
          .post("/intelliq_api/signup")
          .send(newUser)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("status");
            res.body.status.should.equal("OK");
            done();
          })
          .timeout(1000000);
      });
    });

    describe("/login", () => {
      it("it should login an admin to have access to the endpoints", (done) => {
        const user = {
          username: "test-admin1",
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
            res.body.should.have.property("status");
            res.body.should.have.property("data");
            res.body.data.should.have.property("questionnaires");
            if (res.body.data.questionnaires.length == 0) {
              res.should.have.status(402);
              res.body.status.should.equal("no data");
            } else {
              res.should.have.status(200);
              res.body.status.should.equal("OK");
            }
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

    describe("Delete the test-user1", () => {
      describe("/login", () => {
        it("it should login the Super Admin to have access to the endpoint", (done) => {
          const user = {
            username: "TheUltraSuperAdmin",
            password: "the-password-is-secret",
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

      describe("/intelliq_api/admin/users/:username", () => {
        it("it should delete the test-user1", (done) => {
          chai
            .request(server)
            .delete("/intelliq_api/admin/users/deleteUser/test-admin1")
            .set("Cookie", `jwt=${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("status");
              res.body.status.should.equal("OK");
              done();
            })
            .timeout(1000000);
        });
      });
    });
  });
});
