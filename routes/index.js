var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Medicine = require('../models/request');
var Expired = require('../models/expired');
var Review = require('../models/review')
const bodyParser = require('body-parser');
const { MongoClient, Db } = require('mongodb');



router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});

router.get('/signup', function (req, res, next) {
	return res.render('signup.ejs');
});
router.post('/signup', function (req, res, next) {
	console.log(req.body);
	var personInfo = req.body;

	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, function (err, data) {
				if (!data) {
					var c;
					User.findOne({}, function (err, data) {

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						} else {
							c = 1;
						}

						var newPerson = new User({
							unique_id: c,
							email: personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function (err, Person) {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);

					//res.send({ "Success": "You are regestered,You can login now." });
					res.redirect('/login');
				} else {
					//res.send({ "Success": "Email is already used." });
					res.redirect('/');
				}

			});
		} else {
			//res.send({ "Success": "password is not matched" });
			res.redirect('/');
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {

	User.findOne({ email: req.body.email }, function (err, data) {
		if (data) {

			if (data.password == req.body.password) {
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({ "Success": "Success!" });

			} else {
				res.send({ "Success": "Wrong password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});
////////////////////////////


////////////////////////
router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/');
		} else {
			//console.log("found");
			return res.render('data.ejs', { "name": data.username, "email": data.email });
		}
	});
});


//////////////////////////////

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

//////////////////////////////
router.get('/about', function (req, res, next) {
	return res.render('about.ejs');
});
////////////////////////////////

////////////////////////////////

////////////////////////////////
router.get('/request', function (req, res, next) {
	return res.render('request.ejs');
});
////////////////////////////////
router.get('/viewmedicine', function (req, res, next) {
	return res.render('viewmedicine.ejs');
});
////////////////////////////////

////////////////////////////////

////////////////////////////////
router.get('/buy', function (req, res, next) {
	return res.render('buy.ejs');
});
//////////////////////////////

router.post('/request', function (req, res, next) {
	console.log(req.body);
	var medicineInfo = req.body;

	var c;
	Medicine.findOne({}, function (err, data) {

		if (data) {
			console.log("if");
			c = data.unique_id + 1;
		} else {
			c = 1;
		}

		var newMedicine = new Medicine({
			unique_id: c,
			name: medicineInfo.name,
			phone: medicineInfo.phone,
			email: medicineInfo.email,
			medicine_name: medicineInfo.medicine_name,
			quantity: medicineInfo.quantity,
			address: medicineInfo.address,
		});

		newMedicine.save(function (err, data) {
			if (err)
				console.log(err);


			else

				console.log('Success');

		});

	}).sort({ _id: -1 }).limit(1);
	res.redirect('/');
	//res.send({ "Success": "we will contact with you." });

}


);


/////////////////////////////
router.get('/confirm', function (req, res, next) {
	return res.render('confirm.ejs');
});

////////////////////////////////
router.get('/expired', function (req, res, next) {

	return res.render('expired.ejs');
});
//////////////////////////////

router.post('/expired', function (req, res, next) {
	console.log(req.body);
	var expiredInfo = req.body;

	var c;
	Expired.findOne({}, function (err, data) {

		if (data) {
			console.log("if");
			c = data.unique_id + 1;
		} else {
			c = 1;
		}

		var newExpired = new Expired({
			unique_id: c,
			name: expiredInfo.name,
			phone: expiredInfo.phone,
			email: expiredInfo.email,
			medicine_name: expiredInfo.medicine_name,
			expired_date: expiredInfo.expired_date

		});

		newExpired.save(function (err, data) {
			if (err)
				console.log(err);

			else

				console.log('Success');

		});

	}).sort({ _id: -1 }).limit(1);
	res.redirect('/');
	//res.send({ "Success": "we will contact with you." });

}


);


/////////////////////////////get review list
router.get('/review', async function (req, res, next) {
	if (!req.session.userId) {
		return res.redirect("/login")
	}
	const reviewList = await Review.find({}).sort({ date: -1 })

	return res.render('review.ejs', {
		reviewList
	});
});

//////////////////////////////add new review
router.post('/review', async function (req, res, next) {
	if (!req.session.userId) {
		return res.redirect("/login")
	}

	const new_review = new Review({ ...req.body, date: new Date() })
	await new_review.save()

	res.redirect("/review")
});

///delete review
router.get('/review/delete', async function (req, res, next) {
	if (!req.session.userId) {
		return res.redirect("/login")
	}
	const { id } = req.query
	await Review.findOneAndDelete({ _id: id })

	res.redirect("/review")
});

///get edit review page
router.get('/update_review', async function (req, res, next) {
	if (!req.session.userId) {
		return res.redirect("/login")
	}
	const { id } = req.query
	const review = await Review.findOne({ _id: id })

	return res.render('review_edit.ejs', {
		review
	});
});

///update review
router.post('/update_review/:id', async function (req, res, next) {
	if (!req.session.userId) {
		return res.redirect("/login")
	}
	const { id } = req.params
	const { name, text } = req.body
	const review = await Review.findOne({ _id: id })

	review.name = name
	review.text = text

	await review.save()

	res.redirect("/review")
});

module.exports = router;


