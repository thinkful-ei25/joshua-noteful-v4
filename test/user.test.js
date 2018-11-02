'use strict';
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_MONGODB_URI } = require('../config');

const User = require('../models/user');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Noteful API - Users', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  const fullname = 'Example User';
  const nonStringUser = 325;
  const nonStringPass = 325;
  const nonTrimName = ' this is not trimmed ';
  const nonTrimPass = '   dfhwqiohdfowf ';
  const emptyUser = '';
  const shortPass = 'short';
  const longPass = 'fhbwioehfeiowhfioeoewhfhewohfewohfoewhfoiewhfioewhfioehwoifhewohfoeiwhfioewhfioewhfioehofihewofhieowhfioewhfioewhfioewhfioewhfioewhfioewhfioehfiowehfeiohfeiohfeiohfioewhfioewhfioehfioewhfioewhfeiowhfioehfioehfieohfeiohfioewhfieowhfeiowhfeiowhfioewhfewiohfeiowhefio';


  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return User.createIndexes();
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });
  
  describe('/api/users', function () {
    describe('POST', function () {
      it('Should create a new user', function () {
        const testUser = { username, password, fullname };

        let res;
        return chai
          .request(app)
          .post('/api/users')
          .send(testUser)
          .then(_res => {
            res = _res;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('id', 'username', 'fullname');

            expect(res.body.id).to.exist;
            expect(res.body.username).to.equal(testUser.username);
            expect(res.body.fullname).to.equal(testUser.fullname);

            return User.findOne({ username });
          })
          .then(user => {
            expect(user).to.exist;
            expect(user.id).to.equal(res.body.id);
            expect(user.fullname).to.equal(testUser.fullname);
            return user.validatePassword(password);
          })
          .then(isValid => {
            expect(isValid).to.be.true;
          });
      });
      it('Should reject users with missing username', function () {
        const testUser = { password, fullname };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('get out of here hackers!');

          });
      });

      /**
       * COMPLETE ALL THE FOLLOWING TESTS
       */
      it('Should reject users with missing password', function() {
        const testUser = { username, fullname };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('get out of here hackers!');

          });
      });
      it('Should reject users with non-string username', function() {
        const testUser = { nonStringUser, fullname, password };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('get out of here hackers!');

          });
      });
      it('Should reject users with non-string password', function() {
        const testUser = { username, nonStringPass, fullname };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('get out of here hackers!');

          });
      });
      it('Should reject users with non-trimmed username' , function() {
        const testUser = { nonTrimName, password, fullname };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);

          });
      });
      it('Should reject users with non-trimmed password' , function() {
        const testUser = { username, nonTrimPass, fullname };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
          });
      });
      it('Should reject users with empty username' , function() {
        const testUser = { emptyUser, password, fullname };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
          });
      });
      it('Should reject users with password less than 8 characters' , function() {
        const testUser = { username, shortPass, fullname };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
          });
      });
      it('Should reject users with password greater than 72 characters' , function() {
        const testUser = { username, longPass, fullname };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
          });
      });
      it('Should reject users with duplicate username' , function() {
        const testUser = { username, password, fullname };
        return User.create(testUser)
          .then(() => {
            return chai.request(app).post('/api/users').send(testUser)
              .catch(err => err.response)
              .then(res => {
                expect(res).to.have.status(400);
              });
          });
      });
    });
  });
});