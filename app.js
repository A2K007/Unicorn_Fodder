const express = require("express");
const app = express();
const { dirname } = require('path');
const path = require('path');
const mongoose = require("mongoose");
const { connect } = require("http");
const { brotliDecompressSync } = require("zlib");
mongoose.connect('mongodb+srv://avishkar07:Avishkar@picsoreel2k23.dmgzdik.mongodb.net/Voting?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.once('open', function() {
    console.log("Hello");
})
app.use(express.urlencoded({ extended: false }));
var contactshema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
})
var startupschema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    cinnumber: { type: Number, required: true },
    companyname: { type: String, required: true },
    domainname: { type: String, required: true },
    namefounder: { type: String, required: true },
    qualification: { type: String, required: true },
    reveue: { type: Number, required: true },
    profitmargin: { type: Number, required: true },
    designation: { type: String, required: true },
    businessmodel: { type: String, required: true },
    pitchdeck: { type: String, required: true }
})
var investorschema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    companyname: { type: String, required: true },
    domainname: { type: String, required: true },
    namefounder: { type: String, required: true },
    qualification: { type: String, required: true },
    currnetworth: { type: Number, required: true },
    comapnyport: { type: String, required: true },
    domainsinterest: { type: String, required: true },
})
var potte = mongoose.model("logininfo", contactshema);
var startups = mongoose.model("startupinfo", startupschema);
var investors = mongoose.model("investorinfo", investorschema);

// var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
// var server_host = process.env.YOUR_HOST || '0.0.0.0';
// app.listen(server_port, server_host, function() {
//     console.log('Listening on port %d', server_port);
// });
app.listen(process.env.PORT || 80, () => {
    console.log("Application started and Listening on port 80");
});
app.get('/register', (req, res) => {
    res.sendFile(__dirname + "/register.html");
})
app.use(express.static(__dirname));

app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
// app.get("/done", (req, res) => {
//     investors.find({}, function(err, investor) {
//         res.render('afterstartup', {
//             investorList: investor
//         })
//     })
// })
app.post('/register', function(req, res) {
    var doc = new potte(req.body);
    doc.save(function(err, doc) {
        if (err) console.error(err);
        console.log(doc);
    })
    res.sendFile(path.join(__dirname + '/index.html'));
})
app.post('/startup', function(req, res) {
    var doc = new startups(req.body);
    doc.save(function(err, doc) {
        if (err) console.error(err);
        console.log(doc);
    })
    res.sendFile(path.join(__dirname + '/index.html'));
})
app.post('/investor', function(req, res) {
    var doc = new investors(req.body);
    doc.save(function(err, doc) {
        if (err) console.error(err);
        console.log(doc);
    })
    res.sendFile(path.join(__dirname + '/index.html'));
})
app.post('/done', async(req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    const db = await potte.findOne({ email: email });
    const dbst = await startups.findOne({ email: email });
    const dbin = await investors.findOne({ email: email });
    if (db == null) {
        res.sendFile(path.join(__dirname + '/index.html'));
    } else {
        if (db.password == pass) {
            if (dbst == null && dbin == null) {
                res.sendFile(path.join(__dirname + '/afterlogin.html'));
            } else if (dbst == null) {
                startups.find({}, function(err, investor) {
                    res.render('afterinvestor.ejs', {
                        investorList: investor
                    })
                })
            } else {
                investors.find({}, function(err, investor) {
                    res.render('afterstartup.ejs', {
                        investorList: investor
                    })
                })
            }
        } else {
            res.sendFile(path.join(__dirname + '/wrongpass.html'));
        }
    }
});