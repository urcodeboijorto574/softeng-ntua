process.env.NODE_ENV = "test";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../api-backend/server");
let should = chai.should();
var token;

chai.use(chaiHttp);

describe("Session endpoints", () => {
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

    describe("/session/getallsessionsids", () => {
      it("it should return all session IDs in the database", (done) => {
        chai
          .request(server)
          .get("/intelliq_api/session/getallsessionsids")
          .set("Cookie", `jwt=${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("status");
            res.body.status.should.equal("OK");
            res.body.should.have.property("data");
            res.body.data.should.have.property("sessionIDs");
            done();
          })
          .timeout(1000000);
      });
    });

    describe("/session/getuserquestionnairesession/:questionnaireID", () => {
      it("it should return the session that the logged in user submitted to the questionnaire with the specified questionnaireID", (done) => {
        chai
          .request(server)
          .get("/intelliq_api/session/getuserquestionnairesession/QQ062")
          .set("Cookie", `jwt=${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("status");
            res.body.status.should.equal("OK");
            res.body.should.have.property("data");
            res.body.data.should.have.property("session");
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

    describe("/session/getallquestionnairesessions/:questionnaireID", () => {
      it("it should return all the sessions of the questionnaire with the specified questionnaireID", (done) => {
        chai
          .request(server)
          .get("/intelliq_api/session/getallquestionnairesessions/QQ062")
          .set("Cookie", `jwt=${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("status");
            res.body.status.should.equal("OK");
            res.body.should.have.property("data");
            res.body.data.should.have.property("sessions");
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
