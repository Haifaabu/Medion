var mongoose = require('mongoose');
var Schema = mongoose.Schema;

medicineSchema = new Schema( {
	
	unique_id: Number,
	name: String,
	phone:Number,
	email: String,
	medicine_name :String,
	quantity:Number,
	address:String
	
}),
Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;


