const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");

mongoose.connect('mongodb+srv://shreyas0411:Shreyas0411@cluster0.xtbvp42.mongodb.net/Major_Project');
//     await Listing.deleteMany({});
//     await Listing.insertMany(initData.data);
// };

const initDB = async() => {
    try{
        await Listing.deleteMany();
        await Listing.insertMany(initData.data);
        console.log("data added");
    }
    catch(e) {
        console.log(e);
    }
    
};

initDB();