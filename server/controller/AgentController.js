const AgentService = require('../service/AgentService');
const agentService = new AgentService();

exports.login = async (req, res, next) => {
    try {
        const result = await agentService.login(req);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.signup = async (req, res, next) => {
    try {
        const result = await agentService.signup(req);
        res.json(result);
    } catch (err) {
        next(err);
    }
};
