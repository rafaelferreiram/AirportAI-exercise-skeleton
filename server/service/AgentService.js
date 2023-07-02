const Agent = require('../models/Agent');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = '5eb63d320b1a2c1306a6f8d3fe3abc5d'
const winston = require('winston'); 

class AgentService {
     constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'product-service' },
            transports: [
                new winston.transports.File({ filename: 'airpotAi.log' }),
                new winston.transports.Console() 
            ],
        });
    }

    async login(req) {
        this.logger.info('AgentService.login - start');
        const { username, password } = req.body;
        const agent = await Agent.findOne({ username });
        
        if (!agent) {
            const error = new Error('Invalid username');
            error.status = 401;
            throw error;
        }
            
        const validPassword = await bcrypt.compare(password, agent.password);
        if (!validPassword) {
            const error = new Error('Invalid password');
            error.status = 401;
            throw error;
        }
        
        const token = jwt.sign({ _id: agent._id }, SECRET_KEY);
        this.logger.info('AgentService.login - end - successfully');
        return { token };
    };
    
    async signup (req) {
        this.logger.info('AgentService.signup - start');
        const { username, password, role } = req.body;
        
        const agentExists = await Agent.findOne({ username });
        if (agentExists) {
            const error = new Error('Username already exists');
            error.status = 400;
            throw error;
        }    
    
        const agent = new Agent({
            username: username,
            password: password,
            role: role
        });
    
        await agent.save();
    
        const token = jwt.sign({ _id: agent._id }, SECRET_KEY);
        this.logger.info('AgentService.signup - end - successfully');
        return { token };
    };
}

module.exports = AgentService;
