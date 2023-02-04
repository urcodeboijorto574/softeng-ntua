process.env.NODE_ENV = "test";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../api-backend/server");
let should = chai.should();
var token;

chai.use(chaiHttp);

describe("Super-Admin endpoints", () => {
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
        .post("/intelliq_api/admin/user/test-user/test1234")
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
        .get("/intelliq_api/admin/users/test-user")
        .set("Cookie", `jwt=${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("status");
          res.body.status.should.equal("OK");
          res.body.should.have.property("user");
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
