const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');
const SECRET_KEY = '5eb63d320b1a2c1306a6f8d3fe3abc5d';
const FULL_ROLE_ACCESS = 'agent';

const isRole = (role) => async (req, res, next) => {
  if(!req.headers.authorization){
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  const token = req.headers?.authorization.split(' ')[1];
  

  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const agentId = decodedToken._id;
    const agent = await Agent.findOne({ _id: agentId });

    if (!agent) {
      return res.status(401).json({ message: `Invalid ${role}` });
    }
    
    if(agent.role === FULL_ROLE_ACCESS){
      req.agentId = agentId;  
      next();
      return;
    }

    if (agent.role !== role) {
      return res.status(403).json({ message: 'You are not authorized to perform this operation' });
    }


    req.agentId = agentId;
    next();
  } catch (error) {
    console.log(error.message); 
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const isAgent = isRole('agent');
const isPassenger = isRole('passenger');

module.exports = { isAgent, isPassenger };
