const ProductService = require('../service/ProductService');
const productService = new ProductService();

exports.listProducts = async (req, res) => {
    productService.logger.info('ProductController.listProducts - start');
    const products = await productService.listProducts();
    productService.logger.info('ProductController.listProducts - end');
    res.json(products);
};

exports.createProduct = async (req, res) => {
    productService.logger.info('ProductController.createProduct - start');
    const product = await productService.createProduct(req);
    productService.logger.info('ProductController.createProduct - end');
    res.json(product);
};

exports.deleteProduct = async (req, res) => {
    productService.logger.info('ProductController.deleteProduct - start');
    const result = await productService.deleteProduct(req);
    productService.logger.info('ProductController.deleteProduct - end');
    res.json(result);
};

exports.searchProduct = async (req, res) => {
    productService.logger.info('ProductController.searchProduct - start');
    const products = await productService.searchProduct(req);
    productService.logger.info('ProductController.searchProduct - end');
    res.json(products);
};

exports.foundProduct = async (req, res) => {
    productService.logger.info('ProductController.searchProduct - start');
    const products = await productService.foundProduct(req);
    productService.logger.info('ProductController.searchProduct - end');
    res.json(products);
};