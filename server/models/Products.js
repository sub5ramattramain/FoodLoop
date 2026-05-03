const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
 produs: { type: String, required: true },
 magazin: { type: String, required: true },
 pret_lei: { type: Number, required: true },
 numar_valabil: { type: Number, required: true },
 adresa: { type: String, required: true },
 image: {type: String}
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
