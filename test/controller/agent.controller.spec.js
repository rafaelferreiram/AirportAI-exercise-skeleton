const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const agentController = require('../../server/controller/AgentController.js');
const AgentService = require('../../server/service/AgentService.js');

describe('AgentController', function() {
    let agentService;
    let req;
    let res;
    let next;
    
    beforeEach(function() {
        agentService = sinon.stub(AgentService.prototype);
        req = {
            body: {
                username: 'username',
                password: 'password'
            }
        };
        res = {
            json: sinon.spy(),
        };
        next = sinon.spy();
    });

    afterEach(function() {
        sinon.restore();
    });

    describe('login', function() {
        it('should return a token when login is successful', async function() {
            agentService.login.resolves({ token: 'token' });

            await agentController.login(req, res, next);

            expect(res.json.calledOnceWith({ token: 'token' })).to.be.true;
        });

        it('should forward the error when login is unsuccessful', async function() {
            const error = new Error('Login failed');
            agentService.login.rejects(error);

            await agentController.login(req, res, next);

            expect(next.calledOnceWith(error)).to.be.true;
        });
    });

    describe('signup', function() {
        it('should return a token when signup is successful', async function() {
            agentService.signup.resolves({ token: 'token' });

            await agentController.signup(req, res, next);

            expect(res.json.calledOnceWith({ token: 'token' })).to.be.true;
        });

        it('should forward the error when signup is unsuccessful', async function() {
            const error = new Error('Signup failed');
            agentService.signup.rejects(error);

            await agentController.signup(req, res, next);

            expect(next.calledOnceWith(error)).to.be.true;
        });
    });
});
