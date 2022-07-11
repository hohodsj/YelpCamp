const mongoose = require('mongoose')
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            // Your User ID
            author: '62bbb4b1f72d22c3de59b8ff',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam mollitia quis officia necessitatibus, temporibus iusto eveniet, maxime inventore harum non officiis praesentium? Corporis voluptates, repudiandae delectus iste quasi doloribus non.',
            price,
            geometry: { 
                  "type" : "Point", 
                  "coordinates" : [ 
                        cities[random1000].longitude, 
                        cities[random1000].latitude
                  ] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dbc7bdjhx/image/upload/v1657071342/YelpCamp/ew7bdtconcdamvgfjap2.jpg',
                  filename: 'YelpCamp/hux8rgdnvi0sjo8uulnt'
                },
                {
                  url: 'https://res.cloudinary.com/dbc7bdjhx/image/upload/v1657070706/YelpCamp/xsioarq3bl714j4gpd5v.jpg',
                  filename: 'YelpCamp/qpa1t4mtsa5jgbnh05lm'
                },
                {
                  url: 'https://res.cloudinary.com/dbc7bdjhx/image/upload/v1656961779/YelpCamp/byruxlxfr63noe5zuzy4.jpg',
                  filename: 'YelpCamp/mabefuqx6pbb8hxmgquo'
                }
              ]
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})