process.env.NODE_ENV = "test";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../api-backend/server");
let should = chai.should();
var token;

chai.use(chaiHttp);

//----------------------------------------CREATE TEST QUESTIONNAIRE----------------------------------------//

describe("Create test questionnaire for Questionnaire testing", () => {
  describe("/login", () => {
    it("it should login an admin to create the test questionnaire", (done) => {
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

  describe("/admin/questionnaire_upd", () => {
    it("it should create a questionnaire with questionnaireID = 12345", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/questionnaire_upd")
        .set("Cookie", `jwt=${token}`)
        .attach("file", "../api-backend/files/correct_questionnaire_12345.txt")
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

//------------------------------------------QUESTIONNAIRES TESTING-----------------------------------------//
//-----------------------------------------------GOOD SCENARIO---------------------------------------------//

describe("Questionnaire endpoints good scenario (returning '200 OK' or '402 no data')", () => {
  describe("Accessed by users:", () => {
    describe("/login", () => {
      it("it should login a user to have access to the endpoints", (done) => {
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

    describe("/questionnaire/deletequestionnaire/:questionnaireID", () => {
      it("it should delete the specified questionnaire and all related documents", (done) => {
        chai
          .request(server)
          .delete("/intelliq_api/questionnaire/deletequestionnaire/12345")
          .set("Cookie", `jwt=${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("status");
            res.body.status.should.equal("OK");
            res.body.should.have.property("message");
            res.body.message.should.equal(
              "Questionnaire and related documents deleted successfully"
            );
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

//----------------------------------------CREATE TEST QUESTIONNAIRE----------------------------------------//

describe("Create test questionnaire for deleteQuestionnaire testing", () => {
  describe("/login", () => {
    it("it should login an admin to create the test questionnaire", (done) => {
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

  describe("/admin/questionnaire_upd", () => {
    it("it should create a questionnaire with questionnaireID = 12345", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/questionnaire_upd")
        .set("Cookie", `jwt=${token}`)
        .attach("file", "../api-backend/files/correct_questionnaire_12345.txt")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("status");
          res.body.status.should.equal("OK");
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

    describe("/questionnaire/deletequestionnaire/:questionnaireID", () => {
      it("it should throw an error because there is no logged in admin", (done) => {
        chai
          .request(server)
          .delete("/intelliq_api/questionnaire/deletequestionnaire/12345")
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

    describe("/questionnaire/deletequestionnaire/:questionnaireID", () => {
      it("it should throw an error because a user is logged in", (done) => {
        chai
          .request(server)
          .delete("/intelliq_api/questionnaire/deletequestionnaire/12345")
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

//------------------------------------------QUESTIONNAIRES TESTING-----------------------------------------//
//-----------------------------------------------BAD SCENARIO----------------------------------------------//
//---------------------------LOGGED IN ADMIN NOT AUTHORIZED FOR THE SPECIFIC ACTION------------------------//

describe("Questionnaire endpoints bad scenario (logged in admin not authorized for this action)", () => {
  describe("/signup", () => {
    it("it should create a new admin in database", (done) => {
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
    it("it should login the new admin to cause an error", (done) => {
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

  describe("/questionnaire/deletequestionnaire/:questionnaireID", () => {
    it("it should throw an error because a different admin than the creator is logged in", (done) => {
      chai
        .request(server)
        .delete("/intelliq_api/questionnaire/deletequestionnaire/12345")
        .set("Cookie", `jwt=${token}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("status");
          res.body.should.have.property("message");
          res.body.status.should.equal("failed");
          res.body.message.should.equal("Not authorised");
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

//------------------------------------------QUESTIONNAIRES TESTING-----------------------------------------//
//-----------------------------------------------BAD SCENARIO----------------------------------------------//
//--------------------------------INVALID PARAMETER - WRONG QUESTIONNAIRE ID-------------------------------//

describe("Questionnaire endpoints bad scenario (the specified questionnaire ID does not match any questionnaire/question in the database)", () => {
  describe("/login", () => {
    it("it should login the creator admin to have acces to the endpoints", (done) => {
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

  describe("/questionnaire/deletequestionnaire/:questionnaireID", () => {
    it("it should throw an error because the specified questionnaire ID does not match any questionnaire in the database", (done) => {
      chai
        .request(server)
        .delete("/intelliq_api/questionnaire/deletequestionnaire/1234")
        .set("Cookie", `jwt=${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.should.have.property("message");
          res.body.status.should.equal("failed");
          res.body.message.should.equal("bad request");
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

//-------------------------------------------CLEAN THE DATABASE--------------------------------------------//

describe("Delete the questionnaire with questionnaireID = 12345", () => {
  describe("/login", () => {
    it("it should login the Super Admin to have access to the rest of the endpoints", (done) => {
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

  describe("/questionnaire/deletequestionnaire/:questionnaireID", () => {
    it("it should delete the specified questionnaire and all related documents", (done) => {
      chai
        .request(server)
        .delete("/intelliq_api/questionnaire/deletequestionnaire/12345")
        .set("Cookie", `jwt=${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("status");
          res.body.status.should.equal("OK");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Questionnaire and related documents deleted successfully"
          );
          done();
        })
        .timeout(1000000);
    });
  });
});

describe("Delete the test-admin1", () => {
  describe("/login", () => {
    it("it should login the Super Admin to have access to the rest of the endpoints", (done) => {
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
    it("it should delete the test-admin1", (done) => {
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
