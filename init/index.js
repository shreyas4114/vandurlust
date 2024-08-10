const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");

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