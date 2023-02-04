process.env.NODE_ENV = "test";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require(`${__dirname}/../api-backend/server`);
let should = chai.should();
var token;

chai.use(chaiHttp);

// We need to delete the user before running

describe("Authorization endpoints", () => {
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
