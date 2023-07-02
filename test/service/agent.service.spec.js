const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const AgentService = require('../../server/service/AgentService.js');
const Agent = require('../../server/models/Agent.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('AgentService', () => {
    let agentService, findOneStub, compareStub, signStub, saveStub;
    
    beforeEach(async () => {
        agentService = new AgentService();
        findOneStub = sinon.stub(Agent, 'findOne');
        compareStub = sinon.stub(bcrypt, 'compare');
        signStub = sinon.stub(jwt, 'sign');
        saveStub = sinon.stub(Agent.prototype, 'save');
    
        mongod = new MongoMemoryServer();
        await mongod.start(); // explicitly start the server
        const mongoUri = await mongod.getUri();
    
        if (mongoose.connection.readyState) { // Check if there is an existing connection
            await mongoose.connection.close(); // If so, close it
        }
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    });
    
    
    
    afterEach(async () => {
        sinon.restore();
        await mongoose.connection.close(); // Disconnect after each test
    });
    

    
    it('should return a token when login is successful', async () => {
        findOneStub.resolves({ password: 'hashedPassword', _id: 'id' });
        compareStub.resolves(true);
        signStub.returns('token');
        
        const result = await agentService.login({ body: { username: 'username', password: 'password' } });
        
        expect(result).to.deep.equal({ token: 'token' });
    });
    
    it('should throw an error when the username is not found during login', async () => {
        findOneStub.resolves(null);
        
        await expect(agentService.login({ body: { username: 'username', password: 'password' } }))
            .to.be.rejectedWith('Invalid username');
    });

    it('should throw an error when the password is incorrect during login', async () => {
        findOneStub.resolves({ password: 'hashedPassword', _id: 'id' });
        compareStub.resolves(false);
        
        await expect(agentService.login({ body: { username: 'username', password: 'password' } }))
            .to.be.rejectedWith('Invalid password');
    });

    it('should return a token when signup is successful', async () => {
        findOneStub.resolves(null);
        saveStub.resolves({ _id: 'id' });
        signStub.returns('token');
        
        const result = await agentService.signup({ body: { username: 'username', password: 'password', role: 'agent' } });
        
        expect(result).to.deep.equal({ token: 'token' });
    });

    it('should throw an error when the username already exists during signup', async () => {
        findOneStub.resolves({ username: 'username' });
        
        await expect(agentService.signup({ body: { username: 'username', password: 'password', role: 'passenger' } }))
            .to.be.rejectedWith('Username already exists');
    });
     
    it('should call bcrypt.compare with the correct parameters during login', async () => {
        findOneStub.resolves({ password: 'hashedPassword', _id: 'id' });
        compareStub.resolves(true);
        signStub.returns('token');
        
        await agentService.login({ body: { username: 'username', password: 'password' } });
        
        sinon.assert.calledWith(compareStub, 'password', 'hashedPassword');
    });

    it('should log the start and end messages during login', async () => {
        const loggerStub = sinon.stub(agentService.logger, 'info');
        findOneStub.resolves({ password: 'hashedPassword', _id: 'id' });
        compareStub.resolves(true);
        signStub.returns('token');
        
        await agentService.login({ body: { username: 'username', password: 'password' } });
        
        sinon.assert.calledWith(loggerStub.firstCall, 'AgentService.login - start');
        sinon.assert.calledWith(loggerStub.secondCall, 'AgentService.login - end - successfully');
        loggerStub.restore();
    });
    
    
});
