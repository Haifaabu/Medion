var mongoose = require('mongoose');
var Schema = mongoose.Schema;

expiredSchema = new Schema( {
	
	unique_id: Number,
	name: String,
	phone:Number,
	email: String,
	medicine_name :String,
	expired_date:String

}),
Expired = mongoose.model('Expired', expiredSchema);

module.exports = Expired;


