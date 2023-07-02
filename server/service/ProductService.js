const Product = require('../models/Product');
const mongoose = require('mongoose');
const winston = require('winston'); 

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
        product.lost_time = new Date();
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

        if (!lost_time) {
            products = await Product.find(searchQuery);
          } else {
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
    
      
}

module.exports = ProductService;
