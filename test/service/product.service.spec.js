const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const ProductService = require('../../server/service/ProductService.js');
const Product = require('../../server/models/Product.js');
const mongoose = require('mongoose'); // add this line

describe('ProductService', () => {
    let productService, findStub, saveStub, deleteOneStub;

    beforeEach(() => {
        productService = new ProductService();
        findStub = sinon.stub(Product, 'find');
        saveStub = sinon.stub(Product.prototype, 'save');
        deleteOneStub = sinon.stub(Product, 'deleteOne');
        saveStub.callsFake(function() {
            return Promise.resolve({ ...this, _id: new mongoose.Types.ObjectId().toString() }); // Simulates the behavior of saving the document to the database and returning it with a new _id.
        });
    });
    

    afterEach(() => {
        sinon.restore();
    });

    it('should return a list of products', async () => {
        const products = [{ name: 'product1' }, { name: 'product2' }];
        findStub.resolves(products);

        const result = await productService.listProducts();

        expect(result).to.deep.equal(products);
    });
   
    it('should create a new product', async () => {
        const product = {
            type: "Test Type",
            brand: "Test Brand",
            color: "White",
            description: "Test",
            lost_time: "2023-06-30T14:51:06.157Z",
        };
    
        const result = await productService.createProduct({ body: product });
    
        expect(result).to.have.property('description', product.description);
    });
    

    it('should delete a product', async () => {
        const objectId = new mongoose.Types.ObjectId();
        deleteOneStub.resolves({ deletedCount: 1 });
    
        const result = await productService.deleteProduct({ params: { id: objectId.toString() } });
    
        expect(result).to.equal('Product deleted successfully');
    });

    it('should search products', async () => {
        const products = [{ type: 'product1' }, { type: 'product2' }];
        findStub.resolves(products);

        const result = await productService.searchProduct({ body: { keywords: 'product1' } });

        expect(result).to.deep.equal(products);
    });

    it('should search products by keywords', async () => {
        const products = [{ type: 'Test', brand: 'Brand1' }, { type: 'Product', brand: 'Brand2' }];
        findStub.resolves(products);
    
        const result = await productService.searchProduct({ body: { keywords: 'Test Product' } });
    
        expect(result).to.deep.equal(products);
    });
    
    it('should search products by lost_time', async () => {
        const products = [{ type: 'Test', lost_time: new Date('2023-08-01') }, { type: 'Product', lost_time: new Date('2023-08-01') }];
        findStub.resolves(products);
    
        const result = await productService.searchProduct({ body: { lost_time: '2023-07-01' } });
    
        expect(result).to.deep.equal(products);
    });
    

    it('should return an empty array when no products are found', async () => {
        findStub.resolves([]);

        const result = await productService.searchProduct({ body: { keywords: 'product3' } });

        expect(result).to.deep.equal([]);
    });
});
