const Product = require('../models/Product');
const Agent = require('../models/Agent');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const winston = require('winston'); 
const moment = require('moment');
const SECRET_KEY = '5eb63d320b1a2c1306a6f8d3fe3abc5d';

class ProductService {
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

    async listProducts() {
        this.logger.info('ProductService.listProducts - start');
        const products = await Product.find();
        this.logger.info('ProductService.listProducts - end');
        return products;
    };

    async createProduct(req) {
      this.logger.info('ProductService.createProduct - start');
      const product = new Product(req.body);
      product.lost_time = moment().format('DD/MM/YYYY HH:mm'); // format the current date-time as string
      await product.save();
      this.logger.info('ProductService.createProduct - end');
      return product;
    };
    
    
    async deleteProduct(req) {
        this.logger.info('ProductService.deleteProduct - start');
        await Product.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
        this.logger.info('ProductService.deleteProduct - end');
        return 'Product deleted successfully';
    };
    
    async searchProduct(req) {
        this.logger.info('ProductService.searchProduct - start');
        const { keywords , lost_time } = req.body;
        let products;
        let searchQuery ;
        if (keywords) {     
            const words = keywords.split(' ').filter(word => word);
            // Add word boundaries to the keywords to ensure only full words are matched
            const keywordsSplitted = words.map(word => "\\b" + word + "\\b").join('|');
          
            searchQuery = {
              $or: [
                { type: { $regex: keywordsSplitted, $options: 'i' } },
                { brand: { $regex: keywordsSplitted, $options: 'i' } },
                { color: { $regex: keywordsSplitted, $options: 'i' } },
                { description: { $regex: keywordsSplitted, $options: 'i' } }
              ]
            };
        }

        let lostDateTime;
        if (lost_time) {
            lostDateTime = moment(lost_time, 'DD/MM/YYYY HH:mm').toDate();
            products = await Product.find({
              $and: [
                searchQuery,
                { lost_time: { $gte: new Date(lost_time) } }
              ]
            });
          }
      
        this.logger.info('ProductService.searchProduct - end');
        return products.length > 0 ? products : [];
    }

    async foundProduct(req) {
      this.logger.info('ProductService.foundProduct - start');
      const productId = mongoose.Types.ObjectId(req.params.id);
      const product = await Product.findById(productId);
      const token = req.headers?.authorization.split(' ')[1];    
      const decodedToken = jwt.verify(token, SECRET_KEY);
      const agentId = decodedToken._id;
      const agent = await Agent.findOne({ _id: agentId });
      product.found_by = agent.username;      
      this.logger.info('ProductService.foundProduct - end');
      return product;
  };
    
      
}

module.exports = ProductService;
