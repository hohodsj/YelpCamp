const Campground = require('./models/campground');
const Review = require('./models/review');
const {campgroundSchema, reviewSchema} = require('./schemas');

// Check if user is login
module.exports.isLoggedIn = (req, res, next) => {
    // console.log(`REQ.USER:${req.user}`);
    if(!req.isAuthenticated()) {
        // console.log(req.path, req.originalUrl)
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}

// Check if camground passed in is valid ex. if required fields are being passed in
module.exports.validateCampground = (req, res, next) => {
    console.log(`validateCampground:${JSON.stringify(req.body)}`);
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

// Check if campground created by the login user
module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params; // fetch campground id
    const campground = await Campground.findById(id); //fetch campground object
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// if review passed in is valid
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Check if review created by the login user
module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params; // fetch review id from reviews.js (route)
    const review = await Review.findById(reviewId); //fetch review object
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}