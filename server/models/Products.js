const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
 produs: { type: String, required: true },
 magazin: { type: String, required: true },
 pret_lei: { type: Number, required: true },
 numar_valabil: { type: Number, required: true },
 adresa: { type: String, required: true },
 lat: { type: Number }, //pentru distanta
 lng: { type: Number }, //pentru distanta
 image: {type: String}, //e string pentru ca e path-ul catre imagine
 reducere: {type : Number, default: 0}, //o sa fie procentaj
 tag: {type: String}, //sub forma de "Tag1,Tag2,Tag3" pentru a putea cauta dupa taguri
 ridicare: {type: String}, // cand va ridica: dimineata, pranz, seara
 comanda: {type: String} //sub forma de 8:00-16:00 pentru a vedea cand se poate plasa comanda
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
