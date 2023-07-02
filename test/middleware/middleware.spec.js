const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const Agent = require('../../server/models/Agent');
const { isAgent, isPassenger } = require('../../server/middleware/middleware.js');

describe('isAgent', function() {
  let req;
  let res;
  let next;

  beforeEach(function() {
    req = {
      headers: {
        authorization: 'Bearer token123'
      }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    next = sinon.stub();
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should call the next middleware when the role matches', async function() {
    const decodedToken = {
      _id: 'agent123'
    };
    const agent = {
      _id: 'agent123',
      role: 'agent'
    };
    const verifyStub = sinon.stub(jwt, 'verify').returns(decodedToken);
    const findOneStub = sinon.stub(Agent, 'findOne').resolves(agent);

    await isAgent(req, res, next);

    expect(verifyStub.calledOnceWith('token123', '5eb63d320b1a2c1306a6f8d3fe3abc5d')).to.be.true;
    expect(findOneStub.calledOnceWith({ _id: 'agent123' })).to.be.true;
    expect(req.agentId).to.equal('agent123');
    expect(next.calledOnce).to.be.true;
    expect(res.status.called).to.be.false;
    expect(res.json.called).to.be.false;
  });

  it('should return a 401 status and error message for missing authorization token', async function() {
    req.headers.authorization = undefined;

    await isAgent(req, res, next);

    expect(res.status.calledOnceWith(401)).to.be.true;
    expect(res.json.calledOnceWith({ message: 'Missing authorization token' })).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should return a 401 status and error message for invalid token', async function() {
    const verifyStub = sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

    await isAgent(req, res, next);

    expect(verifyStub.calledOnceWith('token123', '5eb63d320b1a2c1306a6f8d3fe3abc5d')).to.be.true;
    expect(res.status.calledOnceWith(401)).to.be.true;
    expect(res.json.calledOnceWith({ message: 'Invalid token' })).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should return a 401 status and error message for invalid agent role', async function() {
    const decodedToken = {
      _id: 'agent123'
    };
    const agent = {
      _id: 'agent123',
      role: 'admin'
    };
    sinon.stub(jwt, 'verify').returns(decodedToken);
    sinon.stub(Agent, 'findOne').resolves(agent);

    await isAgent(req, res, next);

    expect(res.status.calledOnceWith(403)).to.be.true;
    expect(res.json.calledOnceWith({ message: 'You are not authorized to perform this operation' })).to.be.true;
    expect(next.called).to.be.false;
  });
});

// Repeat the above tests for the isPassenger middleware
describe('isPassenger', function() {
    let req;
    let res;
    let next;
  
    beforeEach(function() {
      req = {
        headers: {
          authorization: 'Bearer token123'
        }
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };
      next = sinon.stub();
    });
  
    afterEach(function() {
      sinon.restore();
    });
  
    it('should call the next middleware when the role matches', async function() {
      const decodedToken = {
        _id: 'passenger123'
      };
      const agent = {
        _id: 'passenger123',
        role: 'passenger'
      };
      const verifyStub = sinon.stub(jwt, 'verify').returns(decodedToken);
      const findOneStub = sinon.stub(Agent, 'findOne').resolves(agent);
  
      await isPassenger(req, res, next);
  
      expect(verifyStub.calledOnceWith('token123', '5eb63d320b1a2c1306a6f8d3fe3abc5d')).to.be.true;
      expect(findOneStub.calledOnceWith({ _id: 'passenger123' })).to.be.true;
      expect(req.agentId).to.equal('passenger123');
      expect(next.calledOnce).to.be.true;
      expect(res.status.called).to.be.false;
      expect(res.json.called).to.be.false;
    });
  
    it('should return a 401 status and error message for missing authorization token', async function() {
      req.headers.authorization = undefined;
  
      await isPassenger(req, res, next);
  
      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.json.calledOnceWith({ message: 'Missing authorization token' })).to.be.true;
      expect(next.called).to.be.false;
    });
  
    it('should return a 401 status and error message for invalid token', async function() {
      const verifyStub = sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));
  
      await isAgent(req, res, next);
  
      expect(verifyStub.calledOnceWith('token123', '5eb63d320b1a2c1306a6f8d3fe3abc5d')).to.be.true;
      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.json.calledOnceWith({ message: 'Invalid token' })).to.be.true;
      expect(next.called).to.be.false;
    });

});
