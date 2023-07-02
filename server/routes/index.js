'use strict';

const express = require('express');
const router = express.Router();
const ProductController = require('../controller/ProductController.js')
const AgentController = require('../controller/AgentController.js')
const {isAgent , isPassenger} = require('../middleware/middleware');

// To confirm setup only.
router.get('/', function(req, res) { 
  return res.send('Hello world!'); 
});

// Product routes
router.post('/product', isAgent, (req, res) => ProductController.createProduct(req, res));
router.get('/product', isPassenger, (req, res) => ProductController.listProducts(req, res));
router.delete('/product/:id', isAgent, (req, res) => ProductController.deleteProduct(req, res));
router.post('/product/search', isPassenger, (req, res) => ProductController.searchProduct(req, res));

// Agent routes
router.post('/agent/login', (req, res, next) => AgentController.login(req, res, next));
router.post('/agent/signup', (req, res, next) => AgentController.signup(req, res, next));
module.exports = router;
