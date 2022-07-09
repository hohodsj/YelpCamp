const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dbc7bdjhx/image/upload/w_300/v1656988753/YelpCamp/qqvrznnvhekaiojooju3.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String
});

// add virtual (property does not exists such as full name when there's only first and last name)
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200'); // trim image
});

const CampGroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CampGroundSchema.post('findOneAndDelete', async function(campground) {
    if(campground) {
        await Review.deleteMany({
            _id: {
                $in:campground.reviews
            }
        })
    }
    // console.log(campground)
})
module.exports = mongoose.model('Campground', CampGroundSchema);