process.env.NODE_ENV = "test";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../api-backend/server");
let should = chai.should();
var token;

chai.use(chaiHttp);

//----------------------------------------------------SIGNUP TESTING----------------------------------------------------------//
//---------------------------------------------------GOOD SCENARIOS---------------------------------------------------------//
//---------------------------------------------------GOOD SCENARIO 1--------------------------------------------------------//
//---------------------------------------------------USER IS SIGNED UP, LOGGED IN AND LOGGED OUT----------------------------//
describe("Authorization endpoints good scenario, user is signed up, logged in and logged out", () => {
  describe("/signup", () => {
    it("it should create a new user/admin in database", (done) => {
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
    it("it should login a user/admin with correct username and password", (done) => {
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

  describe("/logout", () => {
    it("it should logout the logged in user/admin", (done) => {
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

//------------------------------BAD SCENARIO: INPUT ONLY MISSING SOME FIELDS-------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------//

describe("Authorization endpoints bad scenario 1, user is signed up without username", () => {
  describe("/signup", () => {
    it("it should throw an error because username does not exists", (done) => {
      const newUser = {
        password: "test1234",
        usermod: "user",
      };
      chai
        .request(server)
        .post("/intelliq_api/signup")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Invalid input data. Please provide a username"
          );
          done();
        })
        .timeout(1000000);
    });
  });
});

describe("Authorization endpoints bad scenario 2, user is signed up without password", () => {
  describe("/signup", () => {
    it("it should throw an error because password does not exists", (done) => {
      const newUser = {
        username: "test-user2",
        usermod: "user",
      };
      chai
        .request(server)
        .post("/intelliq_api/signup")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Invalid input data. Please provide a password"
          );
          done();
        })
        .timeout(1000000);
    });
  });
});

describe("Authorization endpoints bad scenario 3, user is signed up without a role", () => {
  describe("/signup", () => {
    it("it should throw an error because role does not exists", (done) => {
      const newUser = {
        username: "test-user2",
        password: "test1234",
      };
      chai
        .request(server)
        .post("/intelliq_api/signup")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Invalid input data. A user must have a role"
          );
          done();
        })
        .timeout(1000000);
    });
  });
});

describe("Authorization endpoints bad scenario 4, user is signed up without a username and password", () => {
  describe("/signup", () => {
    it("it should throw an error because username and password does not exist", (done) => {
      const newUser = {
        usermod: "user",
      };
      chai
        .request(server)
        .post("/intelliq_api/signup")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Invalid input data. Please provide a username. Please provide a password"
          );
          done();
        })
        .timeout(1000000);
    });
  });
});

describe("Authorization endpoints bad scenario 5, user is signed up without a username and role", () => {
  describe("/signup", () => {
    it("it should throw an error because username and role does not exist", (done) => {
      const newUser = {
        password: "test1234",
      };
      chai
        .request(server)
        .post("/intelliq_api/signup")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Invalid input data. Please provide a username. A user must have a role"
          );
          done();
        })
        .timeout(1000000);
    });
  });
});

describe("Authorization endpoints bad scenario 6, user is signed up without a password and role", () => {
  describe("/signup", () => {
    it("it should throw an error because password and role does not exists", (done) => {
      const newUser = {
        username: "test-user2",
      };
      chai
        .request(server)
        .post("/intelliq_api/signup")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Invalid input data. A user must have a role. Please provide a password"
          );
          done();
        })
        .timeout(1000000);
    });
  });
});

describe("Authorization endpoints bad scenario 7, user is signed up without a password a username and a role", () => {
  describe("/signup", () => {
    it("it should throw an error because username password and role does not exist", (done) => {
      const newUser = {};
      chai
        .request(server)
        .post("/intelliq_api/signup")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Invalid input data. Please provide a username. A user must have a role. Please provide a password"
          );
          done();
        })
        .timeout(1000000);
    });
  });
});

describe("Authorization endpoints bad scenario 8, user is signed up without a password a username and a role", () => {
  describe("/signup", () => {
    it("it should throw an error because username password and role does not exist", (done) => {
      const newUser = {};
      chai
        .request(server)
        .post("/intelliq_api/signup")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Invalid input data. Please provide a username. A user must have a role. Please provide a password"
          );
          done();
        })
        .timeout(1000000);
    });
  });
});

//------------------------------------BAD SCENARIO: INPUT VALIDATION ERROR------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------//
describe("Authorization endpoints bad scenario 9, user is signed up with duplicate username", () => {
  describe("/signup", () => {
    it("it should throw an error because username is used", (done) => {
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
});

describe("Authorization endpoints bad scenario 10, user is signed up with invalid username", () => {
  describe("/signup", () => {
    it("it should throw an error because username is invalid", (done) => {
      const newUser = {
        username: "jimvvvvvvvvvvvvvvvvvvvvvvvvvv",
        password: "test1234",
        usermod: "user",
      };
      chai
        .request(server)
        .post("/intelliq_api/signup")
        .send(newUser)
        .end((err, res) => {
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

describe("Authorization endpoints bad scenario 11, user is signed up with invalid password", () => {
  describe("/signup", () => {
    it("it should throw an error because password is invalid", (done) => {
      const newUser = {
        username: "test-user2",
        password: "t",
        usermod: "user",
      };
      chai
        .request(server)
        .post("/intelliq_api/signup")
        .send(newUser)
        .end((err, res) => {
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

describe("Authorization endpoints bad scenario 12 , user is signed up with invalid role", () => {
  describe("/signup", () => {
    it("it should throw an error because role is invalid", (done) => {
      const newUser = {
        username: "test-user2",
        password: "test1234",
        usermod: "t",
      };
      chai
        .request(server)
        .post("/intelliq_api/signup")
        .send(newUser)
        .end((err, res) => {
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

//-----------------------------------------------LOGIN TESTING--------------------------------------------------------------//
describe("Authorization endpoints bad scenario 12, user is logged in with invalid username", () => {
  describe("/login", () => {
    it("it should throw an error because username is invalid", (done) => {
      const newUser = {
        username: "jimvdoesnt exist",
        password: "test1234",
      };
      chai
        .request(server)
        .post("/intelliq_api/login")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal("Incorrect username or password!");
          done();
        })
        .timeout(1000000);
    });
  });
});

describe("Authorization endpoints bad scenario 13, user is logged in with invalid password", () => {
  describe("/login", () => {
    it("it should throw an error because password is invalid", (done) => {
      const newUser = {
        username: "test-user1",
        password: "does not exist",
      };
      chai
        .request(server)
        .post("/intelliq_api/login")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal("Incorrect username or password!");
          done();
        })
        .timeout(1000000);
    });
  });
});

describe("Authorization endpoints bad scenario 14, user is logged in with invalid username and password", () => {
  describe("/login", () => {
    it("it should throw an error because username and password are invalid", (done) => {
      const newUser = {
        username: "jimvdoesnt exist",
        password: "does not exist",
      };
      chai
        .request(server)
        .post("/intelliq_api/login")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal("Incorrect username or password!");
          done();
        })
        .timeout(1000000);
    });
  });
});

describe("Authorization endpoints bad scenario 15, user is logged in without username", () => {
  describe("/login", () => {
    it("it should throw an error because username does not exist", (done) => {
      const newUser = {
        password: "does not exist",
      };
      chai
        .request(server)
        .post("/intelliq_api/login")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Please provide username and password!"
          );
          done();
        })
        .timeout(1000000);
    });
  });
});

describe("Authorization endpoints bad scenario 16, user is logged in without password", () => {
  describe("/login", () => {
    it("it should throw an error because username does not exist", (done) => {
      const newUser = {
        username: "jimv",
      };
      chai
        .request(server)
        .post("/intelliq_api/login")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Please provide username and password!"
          );
          done();
        })
        .timeout(1000000);
    });
  });
});

describe("Authorization endpoints bad scenario 17, user is logged in without username or password", () => {
  describe("/login", () => {
    it("it should throw an error because username does not exist", (done) => {
      const newUser = {};
      chai
        .request(server)
        .post("/intelliq_api/login")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.status.should.equal("failed");
          res.body.should.have.property("message");
          res.body.message.should.equal(
            "Please provide username and password!"
          );
          done();
        })
        .timeout(1000000);
    });
  });
});
