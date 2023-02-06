process.env.NODE_ENV = "test";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../api-backend/server");
let should = chai.should();
var token;

chai.use(chaiHttp);

//------------------------------------------------------CREATE USER TESTING----------------------------------------------------//
//------------------------------------------------------CREATE A NEW USER AND GET HIM------------------------------------------//
describe("Create User good scenario 1, just create a new user", () => {
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

  describe("/admin/:usermod/:username/:password", () => {
    it("it should create a new user/admin in database or change their password if they already have an account", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/user/test-user1/test1234")
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

  describe("/admin/users/:username", () => {
    it("it should return the user with the given username", (done) => {
      chai
        .request(server)
        .get("/intelliq_api/admin/users/test-user1")
        .set("Cookie", `jwt=${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("status");
          res.body.status.should.equal("OK");
          res.body.should.have.property("user");
          res.body.user.should.have.property("username");
          res.body.user.username.should.equal("test-user1");
          res.body.user.should.have.property("role");
          res.body.user.role.should.equal("user");
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
          done();
        })
        .timeout(1000000);
    });
  });
});

//---------------------------------------------GOOD SCENARIO 2-----------------------------------------------------------------//
//---------------------------------------------UPDATE THE NEW USER'S PASSWORD--------------------------------------------------//

describe("Create User good scenario 2, update the new user's password", () => {
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

  describe("/admin/:usermod/:username/:password", () => {
    it("it should update the new user's password", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/user/test-user1/test1234567")
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
  describe("/admin/users/:username", () => {
    it("it should return the user with the given username", (done) => {
      chai
        .request(server)
        .get("/intelliq_api/admin/users/test-user1")
        .set("Cookie", `jwt=${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("status");
          res.body.status.should.equal("OK");
          res.body.should.have.property("user");
          res.body.user.should.have.property("username");
          res.body.user.username.should.equal("test-user1");
          res.body.user.should.have.property("role");
          res.body.user.role.should.equal("user");
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
          done();
        })
        .timeout(1000000);
    });
  });
});

//---------------------------------------------------------BAD SCENARIOS-------------------------------------------------------//
//---------------------------------------------------------BAD SCENARIO 1------------------------------------------------------//
//------------------------------------------------------NO LOG IN, TRY TO CREATE A USER----------------------------------------//
describe("Create User bad scenario 1, try to create a user withoud log in", () => {
  it("it should throw an error because user is not logged in", (done) => {
    chai
      .request(server)
      .post("/intelliq_api/admin/user/test-user2/test1234567")
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property("status");
        res.body.status.should.equal("failed");
        res.body.should.have.property("message");
        res.body.message.should.equal("Please log in to get access.");
        done();
      })
      .timeout(1000000);
  });
});

//---------------------------------------------------------BAD SCENARIO 2------------------------------------------------------//
//------------------------------------------------TEST-USER 1 TRIES TO CREATE A USER-------------------------------------------//
describe("Create User bad scenario 2, unauthorized user tries to create a user", () => {
  describe("/login", () => {
    it("it should login the test-user1", (done) => {
      const user = {
        username: "test-user1",
        password: "test1234567",
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
  describe("/intelliq_api/admin/:usermod/:username/:password", () => {
    it("it should throw an error because user is unauthorized", (done) => {
      chai
        .request(server)
        .post("/intelliq_api/admin/user/test-user2/test1234567")
        .set("Cookie", `jwt=${token}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal("User unauthorized to continue!");
          done();
        })
        .timeout(1000000);
    });
  });
});

//---------------------------------------------------------BAD SCENARIOS 3-10 ----------------------------------------------------//
//---------------------------------------------------------INVALID INPUT----------------------------------------------------------//
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

  describe("Create User bad scenario 3 invalid usermod", () => {
    describe("/admin/:usermod/:username/:password", () => {
      it("it should throw an error because usermod is invalid", (done) => {
        chai
          .request(server)
          .post("/intelliq_api/admin/something/test-user1/test1234")
          .set("Cookie", `jwt=${token}`)
          .end((req, res) => {
            res.should.have.status(400);
            res.body.should.have.property("status");
            res.body.status.should.equal("failed");
            res.body.should.have.property("message");
            res.body.message.should.equal(
              "Invalid input data. Role must be user or admin"
            );
            done();
          })
          .timeout(1000000);
      });
    });
  });

  describe("Create User bad scenario 4 invalid username", () => {
    describe("/admin/:usermod/:username/:password", () => {
      it("it should throw an error because username is invalid", (done) => {
        chai
          .request(server)
          .post(
            "/intelliq_api/admin/user/test-user1nnnnnnnnnnnnnnnnnnnnnnnddaaann/test1234"
          )
          .set("Cookie", `jwt=${token}`)
          .end((req, res) => {
            res.should.have.status(400);
            res.body.should.have.property("status");
            res.body.status.should.equal("failed");
            res.body.should.have.property("message");
            res.body.message.should.equal(
              "Invalid input data. A username must have at most 20 characters"
            );
            done();
          })
          .timeout(1000000);
      });
    });
  });

  describe("Create User bad scenario 5 invalid password", () => {
    describe("/admin/:usermod/:username/:password", () => {
      it("it should throw an error because password is invalid", (done) => {
        chai
          .request(server)
          .post("/intelliq_api/admin/user/test-user1/t")
          .set("Cookie", `jwt=${token}`)
          .end((req, res) => {
            res.should.have.status(400);
            res.body.should.have.property("status");
            res.body.status.should.equal("failed");
            res.body.should.have.property("message");
            res.body.message.should.equal(
              "Invalid input data. A password must have at least 8 characters"
            );
            done();
          })
          .timeout(1000000);
      });
    });
  });

  describe("Create User bad scenario 6 invalid usermod and password", () => {
    describe("/admin/:usermod/:username/:password", () => {
      it("it should throw an error because usermod and password are invalid", (done) => {
        chai
          .request(server)
          .post("/intelliq_api/admin/t/test-user1/t")
          .set("Cookie", `jwt=${token}`)
          .end((req, res) => {
            res.should.have.status(400);
            res.body.should.have.property("status");
            res.body.status.should.equal("failed");
            res.body.should.have.property("message");
            res.body.message.should.equal(
              "Invalid input data. Role must be user or admin. A password must have at least 8 characters"
            );
            done();
          })
          .timeout(1000000);
      });
    });
  });

  describe("Create User bad scenario 7 invalid usermod and username", () => {
    describe("/admin/:usermod/:username/:password", () => {
      it("it should throw an error because usermod and username are invalid", (done) => {
        chai
          .request(server)
          .post(
            "/intelliq_api/admin/t/tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt/test1234"
          )
          .set("Cookie", `jwt=${token}`)
          .end((req, res) => {
            res.should.have.status(400);
            res.body.should.have.property("status");
            res.body.status.should.equal("failed");
            res.body.should.have.property("message");
            res.body.message.should.equal(
              "Invalid input data. Role must be user or admin. A username must have at most 20 characters"
            );
            done();
          })
          .timeout(1000000);
      });
    });
  });

  describe("Create User bad scenario 8 invalid username and password", () => {
    describe("/admin/:usermod/:username/:password", () => {
      it("it should throw an error because username and password are invalid", (done) => {
        chai
          .request(server)
          .post(
            "/intelliq_api/admin/user/tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt/t"
          )
          .set("Cookie", `jwt=${token}`)
          .end((req, res) => {
            res.should.have.status(400);
            res.body.should.have.property("status");
            res.body.status.should.equal("failed");
            res.body.should.have.property("message");
            res.body.message.should.equal(
              "Invalid input data. A username must have at most 20 characters. A password must have at least 8 characters"
            );
            done();
          })
          .timeout(1000000);
      });
    });
  });

  describe("Create User bad scenario 9 invalid username and password and usermod", () => {
    describe("/admin/:usermod/:username/:password", () => {
      it("it should throw an error because usermod and password and usermod are invalid", (done) => {
        chai
          .request(server)
          .post(
            "/intelliq_api/admin/t/tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt/t"
          )
          .set("Cookie", `jwt=${token}`)
          .end((req, res) => {
            res.should.have.status(400);
            res.body.should.have.property("status");
            res.body.status.should.equal("failed");
            res.body.should.have.property("message");
            res.body.message.should.equal(
              "Invalid input data. Role must be user or admin. A username must have at most 20 characters. A password must have at least 8 characters"
            );
            done();
          })
          .timeout(1000000);
      });
    });
  });

  describe("Create User bad scenario 10 duplicate username. Try to create user with username that exists, but with different role", () => {
    describe("/admin/:usermod/:username/:password", () => {
      it("it should throw an error because username already exists", (done) => {
        chai
          .request(server)
          .post("/intelliq_api/admin/admin/test-user1/12345678")
          .set("Cookie", `jwt=${token}`)
          .end((req, res) => {
            res.should.have.status(400);
            res.body.should.have.property("status");
            res.body.status.should.equal("failed");
            res.body.should.have.property("message");
            res.body.message.should.equal(
              "Username taken! Please provide a new username."
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
            done();
          })
          .timeout(1000000);
      });
    });
  });
});

//------------------------------------------------------END OF CREATE USER TESTING-----------------------------------------------//
//------------------------------------------------------GET USER TESTING---------------------------------------------------------//
//---------------------------------------------------------BAD SCENARIOS---------------------------------------------------------//
//---------------------------------------------------------BAD SCENARIO 1-------------------------------------------------------D//
//------------------------------------------------------GET A USER AND WITHOUT LOGIN--------------------------------------------//
describe("Get User bad scenario 1, no logged in user tries to get a user", () => {
  describe("/admin/users/:username", () => {
    it("it should throw an error becauese user is not logged in", (done) => {
      chai
        .request(server)
        .get("/intelliq_api/admin/users/test-user1")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal("Please log in to get access.");
          done();
        })
        .timeout(1000000);
    });
  });
});

//---------------------------------------------------------BAD SCENARIO 2---------------------------------------------------------//
//------------------------------------------------------TEST-USER 1 TRIES TO GET A USER-------------------------------------------//
describe("Get User bad scenario 2, unauthorized user tries to get a user", () => {
  describe("/login", () => {
    it("it should login the test-user1", (done) => {
      const user = {
        username: "test-user1",
        password: "test1234567",
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
    it("it should throw an error because user is unauthorized", (done) => {
      chai
        .request(server)
        .get("/intelliq_api/admin/users/test-user1")
        .set("Cookie", `jwt=${token}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal("User unauthorized to continue!");
          done();
        })
        .timeout(1000000);
    });
  });
});

//---------------------------------------------------------BAD SCENARIO 3---------------------------------------------------------//
//------------------------------------------------------THE USER THAT IS GET DOEN'T EXIST-----------------------------------------//
describe("Get User bad scenario 3, the user that is get does not exist", () => {
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
    it("it should throw an error because user doesn't exist", (done) => {
      chai
        .request(server)
        .get("/intelliq_api/admin/users/aAuserThatDoesNotExist")
        .set("Cookie", `jwt=${token}`)
        .end((err, res) => {
          res.should.have.status(402);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "No user found with the given username."
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
          done();
        })
        .timeout(1000000);
    });
  });
});

//------------------------------------------------------CLEAN THE DATABASE-------------------------------------------------------//
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
