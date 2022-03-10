const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
});

const wikiSchema = new mongoose.Schema({
    title: String,
    content: String,
});
const Wiki = mongoose.model("wiki", wikiSchema);

const homeStartingContent = new Wiki({
    title: "Welcome to the Wiki",
    content:
        "This is your home page. You can edit this page by clicking on the edit button.",
});

let wikiList = [homeStartingContent];

Wiki.insertMany(wikiList, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Wiki list added");
    }
});

app.get("/", function (req, res) {
    res.send(
        // Wiki.findOne({ title: "Welcome to the Wiki" }).then(function (result) {
        //     // res.render("home", {
        //     //     //rendering the home page
        //     //     homeStartingContent: result,
        //     // });
        // })
        "Hello World"
    );
});

app.listen(port, () => {
    console.log("Server started on port 3000");
});
