const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    type: String,
    brand: String,
    color: String,
    description: String,
    lost_time: Date,
    found_time: Date,
    found_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent'
    }
});

module.exports = mongoose.model('Product', ProductSchema);
