process.env.NODE_ENV = "test";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../api-backend/server");
let should = chai.should();
var token;

chai.use(chaiHttp);

//-----------------------------------------------------GOOD SENARIOS-----------------------------------------------------//

//----------------------------------------Admin Testing----------------------------------------------------//
//----------------------------------------CREATE TEST QUESTIONNAIRE----------------------------------------//
//----------------------------------------ResetQuestionnaire test------------------------------------------//

describe("Create test questionnaire for resetQuestionnaire and test resetQuestionnaire with admin logged in", () => {
    describe("/signup", () => {
        it("it should create a new admin in database", (done) => {
          const newUser = {
            username: "testAdmin9921",
            password: "admin9921",
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
      it("it should login an admin to create the test questionnaire", (done) => {
        const user = {
          username: "testAdmin9921",
          password: "admin9921",
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

    describe("/admin/resetq/:questionnaireID", () => {
        it("it should delete all answers to the questionnaire with ID: 12345", (done) => {
          chai
            .request(server)
            .post("/intelliq_api/admin/resetq/12345")
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


//--------------------------------------------Super-Admin Testing--------------------------------------------//
//--------------------------------------------healthcheck, resetAll, resetq testing--------------------------//
//--------------------------------------------Good Senario---------------------------------------------------//

describe("Super-Admin Operations good scenario 1 (healthcheck, resetAll, restq)", () => {
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
      
    describe("/admin/healthcheck", () => {
        it("it should check database connectivity", (done) => {
            const DB = process.env.DATABASE.replace(
                '<PASSWORD>',
                process.env.DATABASE_PASSWORD
            );
          chai
            .request(server)
            .get("/intelliq_api/admin/healthcheck")
            .set("Cookie", `jwt=${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("status");
              res.body.status.should.equal("OK");
              res.body.should.have.property("dbconnection");
              res.body.dbconnection.should.equal(DB);
              done();
            })
            .timeout(1000000);
        });
    });

    describe("/admin/resetq/:questionnaireID", () => {
        it("it should delete all answers to the questionnaire with ID: 12345", (done) => {
          chai
            .request(server)
            .post("/intelliq_api/admin/resetq/12345")
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

    describe("/logout", () => {
        it("it should logout the Super Admin", (done) => {
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


//----------------------------------------------------BAD SENARIOS----------------------------------------------------------//

//---------------------------------------------Bad Senario 1-----------------------------------------//
//---------------------------------------------No Log In---------------------------------------------//
//---------------------------------------------healthcheck, resetAll, resetq testing-----------------//

describe("Healthcheck, resetAll, resetQuestionnaire endpoints bad scenario (no log in)", () => {
    describe("/admin/healthcheck", () => {
        it("it should throw an error because no super-admin is logged in", (done) => {
          chai
            .request(server)
            .get("/intelliq_api/admin/healthcheck")
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

    describe("/admin/resetq/:questionnaireID", () => {
        it("it should throw an error because no super-admin or admin is logged in", (done) => {
          chai
            .request(server)
            .post("/intelliq_api/admin/resetq/12345")
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


//---------------------------------------------Bad Senario 2-----------------------------------------//
//---------------------------------------------logged in user anauthorised for this action-------------------------------------//
//---------------------------------------------healthcheck, resetAll, resetq testing-----------------//

describe("Healthcheck, resetAll, resetQuestionnaire endpoints bad scenario (logged in user not authorized for this action)", () => {
    describe("/signup", () => {
      it("it should create a new user in database", (done) => {
        const newUser = {
          username: "testUser5200",
          password: "test5200",
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
          username: "testUser5200",
          password: "test5200",
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

    describe("/admin/healthcheck", () => {
        it("it should throw an error because a user is logged in", (done) => {
          chai
            .request(server)
            .get("/intelliq_api/admin/healthcheck")
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

    describe("/admin/resetq/:questionnaireID", () => {
        it("it should throw an error because a user is logged in", (done) => {
          chai
            .request(server)
            .post("/intelliq_api/admin/resetq/12345")
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


//---------------------------------------------Bad Senario 3-----------------------------------------//
//---------------------------------------------logged in admin anauthorised for this action-------------------------------------//
//---------------------------------------------healthcheck, resetAll, testing-----------------//

describe("Healthcheck, resetAll, resetQuestionnaire endpoints bad scenario (logged in admin not authorized for this action)", () => {
    describe("/login", () => {
        it("it should login an admin to cause an error because admins are not authorised fo these actions", (done) => {
          const user = {
            username: "testAdmin9921",
            password: "admin9921",
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

      describe("/admin/healthcheck", () => {
        it("it should throw an error because an admin is logged in", (done) => {
          chai
            .request(server)
            .get("/intelliq_api/admin/healthcheck")
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


//---------------------------------------------Bad Senario 4-----------------------------------------//
//---------------------------------------------Not valid format (json or csv)-------------------------------------//
//---------------------------------------------healthcheck, resetAll, testing-----------------//

describe("Healthcheck, resetAll, resetq operations Not valid format (json or csv)", () => {
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
    
      describe("/admin/healthcheck?format=bad_format", () => {
        it("it should throw an error because format != json && format = csv", (done) => {
            const DB = process.env.DATABASE.replace(
                '<PASSWORD>',
                process.env.DATABASE_PASSWORD
            );
          chai
            .request(server)
            .get("/intelliq_api/admin/healthcheck?format=jso")
            .set("Cookie", `jwt=${token}`)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property("status");
                res.body.status.should.equal("failed");
                res.body.should.have.property("message");
                res.body.message.should.equal("Response format must be either json or csv!");
              done();
            })
            .timeout(1000000);
        });
    });

    describe("/admin/resetq/:questionnaireID", () => {
        it("it should throw an error because format != json && format = csv", (done) => {
          chai
            .request(server)
            .post("/intelliq_api/admin/resetq/12345?format=jso")
            .set("Cookie", `jwt=${token}`)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property("status");
                res.body.status.should.equal("failed");
                res.body.should.have.property("reason");
                res.body.reason.should.equal("Response format must be either json or csv!");
              done();
            })
            .timeout(1000000);
        });
      });

    describe("/logout", () => {
        it("it should logout the Super Admin", (done) => {
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


//---------------------------------------------Bad Senario 5-----------------------------------------//
//-------------------------------------------Not valid questionnaireID ------------------------------//
//------------------------------------------creator != logged in admin-------------------------------//
//--------------------------------------------- resetq testing---------------------------------------//

describe("Create test admin for resetQuestionnaire and test it with questionnnaire that logged in admin is not its creator", () => {
  describe("/signup", () => {
      it("it should create a new admin in database", (done) => {
        const newUser = {
          username: "testAdmin2000",
          password: "admin2000",
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
    it("it should login an admin to try resetQuestionnaire the test questionnaire", (done) => {
      const user = {
        username: "testAdmin2000",
        password: "admin2000",
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

  describe("/admin/resetq/:notValid_questionnaireID", () => {
    it("it should throw an error because questionnaireID is not valid", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/resetq/123456789")
        .set("Cookie", `jwt=${token}`)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("status");
            res.body.status.should.equal("failed");
            res.body.should.have.property("reason");
            res.body.reason.should.equal("Invalid questionnaireID");
          done();
        })
        .timeout(1000000);
    });
  });

  describe("/admin/resetq/:questionnaireID", () => {
    it("it should throw an error because the admin logged in is not the creator of the Questionnaire that he is trying to reset", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/resetq/12345")
        .set("Cookie", `jwt=${token}`)
        .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property("status");
            res.body.status.should.equal("failed");
            res.body.should.have.property("reason");
            res.body.reason.should.equal("User unauthorized to continue!");
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


//--------------------------------------------CLEAN DATABASE---------------------------------------//

//-------------------------------Delete Questionnaire-----------------------------//

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

  describe("/questionnaire/deletequestionnaire/12345", () => {
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
    it("it should logout the Super Admin", (done) => {
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

describe("Delete the testUuser5200, testAdmin9921, testAdmin2000", () => {
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
  describe("/intelliq_api/admin/users/deleteUser/:username", () => {
    it("it should delete the testUser5200", (done) => {
      chai
        .request(server)
        .delete("/intelliq_api/admin/users/deleteUser/testUser5200")
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

  describe("/intelliq_api/admin/users/deleteUser/:username", () => {
    it("it should delete the testAdmin9921", (done) => {
      chai
        .request(server)
        .delete("/intelliq_api/admin/users/deleteUser/testAdmin9921")
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

  describe("/intelliq_api/admin/users/deleteUser/:username", () => {
    it("it should delete the testAdmin2000", (done) => {
      chai
        .request(server)
        .delete("/intelliq_api/admin/users/deleteUser/testAdmin2000")
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

  describe("/logout", () => {
    it("it should logout the Super Admin", (done) => {
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

