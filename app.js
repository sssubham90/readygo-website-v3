const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const app = express()


//mongoose.Promise = global.Promise;
//var dbMac = '127.0.0.1';
//mongoose.connect('mongodb://' + dbMac + ':27017/admin', {
//    useNewUrlParser: true
//});

//var feedbackSchema = new mongoose.Schema({
//    name: String,
//    email: String,
//    message: String
//});
//var Feedback = mongoose.model("Feedback", feedbackSchema);


// app.all(/.*/, function(req, res, next) {
//     var host = req.header("host")
//     if (req.protocol === 'http') {
//         if (host.match(/^www\..*/i)) {
//             next();
//         } else {
//             res.redirect(301, "http://www." + host);
//         }
//     } else if (host.match(/^www\..*/i)) {
//         res.redirect(301, "http://" + host);
//     } else {
//         res.redirect(301, "http://www." + host);
//     }
// });
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
app.use(bodyParser.urlencoded({
    extended: true
}))
app.get('/', (req, res) => res.send(index.html));
app.get('/sitemap.xml', (req, res, next) => res.sendFile(__dirname + '/public/sitemap.xml'));
app.get('/Robots.txt', (req, res, next) => res.sendFile(__dirname + '/public/Robots.txt'));

app.post('/contact-us', (req, res) => {
    res.send("Thank you for contacting us. We will get back to you soon.");
    //var myData = new Feedback(req.body);
    //myData.save()
    //  .then(item => {
    //
    //  })
    //  .catch(err => {
    //      res.status(400).send("Unable to send your request. Please give a call on 9178175969.");
    //  });
})
app.listen(process.env.PORT, () => {
    console.log(`${process.env.PORT}`);
})