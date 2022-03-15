const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

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

app.route("/articles")
    .get((req, res) => {
        Wiki.find({}, function (err, foundWiki) {
            if (err) {
                console.log(err);
            } else {
                if (foundWiki.length === 0) {
                    Wiki.insertMany(wikiList, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Wiki list added");
                        }
                    });
                    res.redirect("/");
                } else {
                    res.render("home", { wikiList: foundWiki });
                }
            }
        });
    })
    .post("/articles", function (req, res) {
        const newWiki = new Wiki({
            title: req.body.title,
            content: req.body.content,
        });
        newWiki.save(function (err) {
            if (!err) {
                res.redirect("/articles");
            }
        });
    })
    .put("/articles", function (req, res) {
        var title = req.body.title;
        var content = req.body.content;
        Wiki.updateMany(
            { title: title },
            { title: title, content: content },
            { multi: true },
            function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            }
        );
    })
    .patch("/articles", function (req, res) {
        Wiki.updateOne(
            { title: req.body.title },
            { $set: { content: req.body.content } },
            function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Updated");
                }
            }
        );
    })
    .delete("/articles", function (req, res) {
        Wiki.deleteMany({}, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Wiki list deleted");
            }
        });
        res.redirect("/");
    });

app.get("/", function (req, res) {
    Wiki.find({}, function (err, foundWiki) {
        if (err) {
            console.log(err);
        } else {
            if (foundWiki.length === 0) {
                Wiki.insertMany(wikiList, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Wiki list added");
                    }
                });
                res.redirect("/");
            } else {
                res.render("home", { wikiList: foundWiki });
            }
        }
    });
});

app.app.listen(port, () => {
    console.log("Server started on port 3000");
});
