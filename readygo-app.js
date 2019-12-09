const express = require('express')
const compression = require('compression')
const fs = require('fs')
const http = require('http')
const https = require('https')
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const app = express()

const privateKey = fs.readFileSync('/etc/letsencrypt/live/readygocabs.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/readygocabs.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/readygocabs.com/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};


const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app);


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://root:pJI6hEPvjO3s@13.127.182.236/admin", {
    useNewUrlParser: true
});

var feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});
var Feedback = mongoose.model("Feedback", feedbackSchema);


app.all(/.*/, function(req, res, next) {
    var host = req.header("host")
    if (req.protocol === 'https') {
        if (host.match(/^www\..*/i)) {
            next();
        } else {
            res.redirect(301, "https://www." + host);
        }
    } else if (host.match(/^www\..*/i)) {
        res.redirect(301, "https://" + host);
    } else {
        res.redirect(301, "https://www." + host);
    }
});
app.get('/*', function(req, res, next) {
    if (req.url.indexOf("/images/") === 0 || req.url.indexOf("/styles/") === 0 || req.url.indexOf("/scripts/") === 0 || req.url.indexOf("/fonts/") === 0) {
        res.setHeader("Cache-Control", "public, max-age=2592000");
        res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
    }
    next();
});
app.use(compression())
app.use(express.static('public', {
    extensions: ['html', 'htm'],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => res.send(index.html))
app.get('/sitemap.xml', (req, res, next) => res.sendFile(__dirname + '/public/sitemap.xml'));
app.get('/Robots.txt', (req, res, next) => res.sendFile(__dirname + '/public/Robots.txt'));

app.post('/contact-us', (req, res) => {
    var myData = new Feedback(req.body);
    myData.save()
        .then(item => {
            res.send("Thank you for contacting us. We will get back to you soon.");
        })
        .catch(err => {
            res.status(400).send("Unable to send your request. Please give a call on 9178175969.");
        });
})
httpServer.listen(80, () => { console.log('80') })
httpsServer.listen(443, () => { console.log('443') })