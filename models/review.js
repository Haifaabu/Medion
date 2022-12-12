var mongoose = require('mongoose');
var Schema = mongoose.Schema;

reviewSchema = new Schema( {

	name: String,
	text: String,
    date:Date
}),
Review = mongoose.model('Review', reviewSchema);

module.exports = Review;


