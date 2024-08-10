const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/expressError.js")
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send("This is root");
})

// app.get("/testListing", async (req,res) => {
//     await Listing.create({
//         title: "My home",
//         description: "This is my home in solapur",
//         price: 8500000,
//         location: "Solapur",
//         country: "India"
//     })
//     res.json({
//         msg: "Listing created successfully"
//     })
// });

app.get("/listings", wrapAsync(async (req, res) => {             // show all the listings
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}))

app.get("/listings/new", wrapAsync(async (req, res) => {           // form to accept new listing
    res.render("listings/new.ejs");
}))

app.get("/listings/:id", wrapAsync(async (req, res) => {           // show details of specific listing
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}))

app.post("/listings", wrapAsync(async(req, res, err) => {         // redirect to /listings after accepting new listing
        if(!req.body.listing) {
            throw new ExpressError(400, "Send valid data for listing")
        }
        await Listing.create(req.body.listing);
        res.redirect("/listings");
        const newListing = req.body.listing;
        console.log(newListing);
})
)

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {     //open edit.ejs on the link
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))

app.put("/listings/:id", wrapAsync(async (req, res) => {        // put updated listing 
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}))

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    if(!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing")
    }
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {         // error handling middleware
    let {statusCode = 500, message = "Something went wrong!"} = err;      // dafult status code is 500
    res.status(statusCode).render("error.ejs", {err});
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
