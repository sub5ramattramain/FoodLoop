const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    id_produs: { type: String, required: true },
    nume: { type: String, required: true },
    rating: { type: Number, required: true },
    text: { type: String, required: true },
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;