//model pentru pagina de produse
const mongoose = require('mongoose');
const ShopSchema = new mongoose.Schema({
 numeMagazin: { type: String, required: true },
 image: {type: String},
 adresa: { type: String, required: true }
});
module.exports = mongoose.model('Shop', ShopSchema);