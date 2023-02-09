process.env.NODE_ENV = "test";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../api-backend/server");
let should = chai.should();
var token;

chai.use(chaiHttp);

<<<<<<< HEAD
describe("Questionnaire endpoints", () => {
=======
//------------------------------------------QUESTIONNAIRES TESTING-----------------------------------------//
//-----------------------------------------------GOOD SCENARIO---------------------------------------------//

describe("Questionnaire endpoints good scenario (returning '200 OK' or '402 no data')", () => {
>>>>>>> main
  describe("Accessed by users:", () => {
    describe("/login", () => {
      it("it should login a user to have access to the endpoints", (done) => {
        const user = {
<<<<<<< HEAD
          username: "user-vass",
=======
          username: "test-user",
>>>>>>> main
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
<<<<<<< HEAD
            res.should.have.status(200);
            res.body.should.have.property("status");
            res.body.status.should.equal("OK");
            res.body.should.have.property("data");
            res.body.data.should.have.property("questionnaires");
=======
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
>>>>>>> main
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
<<<<<<< HEAD
            res.should.have.status(200);
            res.body.should.have.property("status");
            res.body.status.should.equal("success");
            res.body.should.have.property("data");
=======
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
>>>>>>> main
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
            token = " ";
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
<<<<<<< HEAD
          username: "admin-vass",
=======
          username: "test-admin",
>>>>>>> main
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
<<<<<<< HEAD
            res.should.have.status(200);
            res.body.should.have.property("status");
            res.body.status.should.equal("OK");
            res.body.should.have.property("data");
            res.body.data.should.have.property("questionnaires");
=======
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
>>>>>>> main
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
            token = " ";
            done();
          })
          .timeout(1000000);
      });
    });
  });
});
<<<<<<< HEAD
=======

//------------------------------------------QUESTIONNAIRES TESTING-----------------------------------------//
//-----------------------------------------------BAD SCENARIO----------------------------------------------//
//-----------------------------------------NO LOGGED IN USER OR ADMIN--------------------------------------//

describe("Questionnaire endpoints bad scenario (no logged in user or admin)", () => {
  describe("Accessed by users:", () => {
    describe("/questionnaire/getuseransweredquestionnaires", () => {
      it("it should throw an error because there is no logged in user", (done) => {
        chai
          .request(server)
          .get("/intelliq_api/questionnaire/getuseransweredquestionnaires")
          .set("Cookie", `jwt=${token}`)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property("status");
            res.body.should.have.property("message");
            res.body.status.should.equal("failed");
            res.body.message.should.equal("Please log in to get access.");
            done();
          })
          .timeout(1000000);
      });
    });

    describe("/questionnaire/getusernotansweredquestionnaires", () => {
      it("it should throw an error because there is no logged in user", (done) => {
        chai
          .request(server)
          .get("/intelliq_api/questionnaire/getusernotansweredquestionnaires")
          .set("Cookie", `jwt=${token}`)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property("status");
            res.body.should.have.property("message");
            res.body.status.should.equal("failed");
            res.body.message.should.equal("Please log in to get access.");
            done();
          })
          .timeout(1000000);
      });
    });
  });

  describe("Accessed by admins:", () => {
    describe("/questionnaire/getadmincreatedquestionnaires", () => {
      it("it should throw an error because there is no logged in admin", (done) => {
        chai
          .request(server)
          .get("/intelliq_api/questionnaire/getadmincreatedquestionnaires")
          .set("Cookie", `jwt=${token}`)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property("status");
            res.body.should.have.property("message");
            res.body.status.should.equal("failed");
            res.body.message.should.equal("Please log in to get access.");
            done();
          })
          .timeout(1000000);
      });
    });
  });
});

//------------------------------------------QUESTIONNAIRES TESTING-----------------------------------------//
//-----------------------------------------------BAD SCENARIO----------------------------------------------//
//------------------------LOGGED IN USER/ADMIN NOT AUTHORIZED FOR THE SPECIFIC ACTION----------------------//

describe("Questionnaire endpoints bad scenario (logged in user/admin not authorized for this action)", () => {
  describe("Accessed by users:", () => {
    describe("/login", () => {
      it("it should login an admin to cause an error", (done) => {
        const user = {
          username: "test-admin",
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
      it("it should throw an error because an admin is logged in", (done) => {
        chai
          .request(server)
          .get("/intelliq_api/questionnaire/getuseransweredquestionnaires")
          .set("Cookie", `jwt=${token}`)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property("status");
            res.body.should.have.property("message");
            res.body.status.should.equal("failed");
            res.body.message.should.equal("User unauthorized to continue!");
            done();
          })
          .timeout(1000000);
      });
    });

    describe("/questionnaire/getusernotansweredquestionnaires", () => {
      it("it should throw an error because an admin is logged in", (done) => {
        chai
          .request(server)
          .get("/intelliq_api/questionnaire/getusernotansweredquestionnaires")
          .set("Cookie", `jwt=${token}`)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property("status");
            res.body.should.have.property("message");
            res.body.status.should.equal("failed");
            res.body.message.should.equal("User unauthorized to continue!");
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
            token = " ";
            done();
          })
          .timeout(1000000);
      });
    });
  });

  describe("Accessed by admins:", () => {
    describe("/login", () => {
      it("it should login a user to cause an error", (done) => {
        const user = {
          username: "test-user",
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
      it("it should throw an error because a user is logged in", (done) => {
        chai
          .request(server)
          .get("/intelliq_api/questionnaire/getadmincreatedquestionnaires")
          .set("Cookie", `jwt=${token}`)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property("status");
            res.body.should.have.property("message");
            res.body.status.should.equal("failed");
            res.body.message.should.equal("User unauthorized to continue!");
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
            token = " ";
            done();
          })
          .timeout(1000000);
      });
    });
  });
});
>>>>>>> main
