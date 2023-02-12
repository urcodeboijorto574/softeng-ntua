process.env.NODE_ENV = "test";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../api-backend/server");
let should = chai.should();
var token;

chai.use(chaiHttp);

//---------------------------------------QUESTIONNAIRE UPDATE TESTING--------------------------------------//
//-----------------------------------------------GOOD SCENARIO---------------------------------------------//

describe("Questionnaire update endpoint good scenario (returning '200 OK')", () => {
  describe("/login", () => {
    it("it should login an admin to create the questionnaire", (done) => {
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

//-----------------------------------------------BAD SCENARIO----------------------------------------------//
//-------------------------------------------NO LOGGED IN OR ADMIN-----------------------------------------//

describe("Questionnaire update endpoint bad scenario (no logged in admin)", () => {
  describe("/admin/questionnaire_upd", () => {
    it("it should throw an error because there is no logged in admin", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/questionnaire_upd")
        .set("Cookie", `jwt=${token}`)
        .attach("file", "../api-backend/files/correct_questionnaire_12345.txt")
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

//-----------------------------------------------BAD SCENARIO----------------------------------------------//
//---------------------------LOGGED IN USER NOT AUTHORIZED FOR THE SPECIFIC ACTION------------------------//

describe("Questionnaire update endpoint bad scenario (logged in user not authorized for this action)", () => {
  describe("/signup", () => {
    it("it should create a new user in database", (done) => {
      const newUser = {
        username: "test-user1",
        password: "test1234",
        usermod: "user",
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
    it("it should login the new user to cause an error", (done) => {
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

  describe("/admin/questionnaire_upd", () => {
    it("it should throw an error because a user is logged in", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/questionnaire_upd")
        .set("Cookie", `jwt=${token}`)
        .attach("file", "../api-backend/files/correct_questionnaire_12345.txt")
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
          done();
        })
        .timeout(1000000);
    });
  });
});

//-----------------------------------------------BAD SCENARIO----------------------------------------------//
//-----------------------------------------WRONG JSON FORMAT IN FILE---------------------------------------//

describe("Questionnaire update endpoint bad scenario (wrong JSON format in input file)", () => {
  describe("/login", () => {
    it("it should login an admin to create the questionnaire", (done) => {
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
    it("it should throw an error because JSON format in file is wrong", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/questionnaire_upd")
        .set("Cookie", `jwt=${token}`)
        .attach("file", "../api-backend/files/wrong_json_format.txt")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal("Invalid file structure");
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

//-----------------------------------------------BAD SCENARIO----------------------------------------------//
//--------------------------------------DUPLICATE VALUE: QUESTIONNAIRE TITLE-------------------------------//

describe("Questionnaire update endpoint bad scenario (duplicate questionnaire title)", () => {
  describe("/login", () => {
    it("it should login an admin to create the questionnaire", (done) => {
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
    it("it should throw an error because a questionnaire with the same title already exists", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/questionnaire_upd")
        .set("Cookie", `jwt=${token}`)
        .attach("file", "../api-backend/files/same_title.txt")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal("Questionnaire Title must be unique");
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

//-----------------------------------------------BAD SCENARIO----------------------------------------------//
//---------------------------------------DUPLICATE VALUE: QUESTIONNAIRE ID---------------------------------//

describe("Questionnaire update endpoint bad scenario (duplicate questionnaire ID)", () => {
  describe("/login", () => {
    it("it should login an admin to create the questionnaire", (done) => {
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
    it("it should throw an error because a questionnaire with the same ID already exists", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/questionnaire_upd")
        .set("Cookie", `jwt=${token}`)
        .attach("file", "../api-backend/files/same_questionnaire_id.txt")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal("All IDs must be unique");
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

//-----------------------------------------------BAD SCENARIO----------------------------------------------//
//-----------------------------------------DUPLICATE VALUE: QUESTION ID------------------------------------//

describe("Questionnaire update endpoint bad scenario (duplicate question ID)", () => {
  describe("/login", () => {
    it("it should login an admin to create the questionnaire", (done) => {
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
    it("it should throw an error because a question with the same ID already exists", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/questionnaire_upd")
        .set("Cookie", `jwt=${token}`)
        .attach("file", "../api-backend/files/same_question_id.txt")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal("All IDs must be unique");
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

//-----------------------------------------------BAD SCENARIO----------------------------------------------//
//-----------------------------------------DUPLICATE VALUE: OPTION ID------------------------------------//

describe("Questionnaire update endpoint bad scenario (duplicate option ID)", () => {
  describe("/login", () => {
    it("it should login an admin to create the questionnaire", (done) => {
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
    it("it should throw an error because an option with the same ID already exists", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/questionnaire_upd")
        .set("Cookie", `jwt=${token}`)
        .attach("file", "../api-backend/files/same_option_id.txt")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal("All IDs must be unique");
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

//-----------------------------------------------BAD SCENARIO----------------------------------------------//
//----------------------------------VALIDATION ERRORS: QUESTIONNAIRE ID + TITLE----------------------------//

describe("Questionnaire update endpoint bad scenario (validation errors)", () => {
  describe("/login", () => {
    it("it should login an admin to create the questionnaire", (done) => {
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
    it("it should throw an error because the title's length is less than 10", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/questionnaire_upd")
        .set("Cookie", `jwt=${token}`)
        .attach("file", "../api-backend/files/small_title.txt")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Invalid input data. A questionnaire title must have more or equal than 10 characters"
          );
          done();
        })
        .timeout(1000000);
    });
  });

  describe("/admin/questionnaire_upd", () => {
    it("it should throw an error because the questionnaire ID is not 5 characters", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/questionnaire_upd")
        .set("Cookie", `jwt=${token}`)
        .attach("file", "../api-backend/files/wrong_questionnaire_id.txt")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Invalid input data. A questionnaire id must have 5 characters"
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

//-----------------------------------------------BAD SCENARIO----------------------------------------------//
//-----------------------------VALIDATION ERRORS: OPEN-TYPE OPTIONS MUST END WITH TXT-------------------------//

describe("Questionnaire update endpoint bad scenario (open-type options error)", () => {
  describe("/login", () => {
    it("it should login an admin to create the questionnaire", (done) => {
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
    it("it should throw an error because an open-type option does not end with TXT", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/questionnaire_upd")
        .set("Cookie", `jwt=${token}`)
        .attach("file", "../api-backend/files/opentype_option_not_txt.txt")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Question 111, Option P90: Questions with only one option are open-type questions so optID should end with 'TXT'"
          );
          done();
        })
        .timeout(1000000);
    });
  });

  describe("/admin/questionnaire_upd", () => {
    it("it should throw an error because a closed-type option ends with TXT", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/questionnaire_upd")
        .set("Cookie", `jwt=${token}`)
        .attach("file", "../api-backend/files/closedtype_option_txt.txt")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Question 222, Option P91TXT: Questions with more than one options are close-type questions so optID shouldn't end with 'TXT'"
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

describe("Delete the test-user1", () => {
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
    it("it should delete the test-user1", (done) => {
      chai
        .request(server)
        .delete("/intelliq_api/admin/users/deleteUser/test-user1")
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
