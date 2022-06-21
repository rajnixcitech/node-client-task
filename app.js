var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let Tesseract = require('tesseract.js');
require('dotenv').config();
const fs = require('fs');
const multer = require('multer');
const replaceColor = require('replace-color')


//route
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.set('view engine', 'ejs');
app.set()

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/users', usersRouter);


var Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname + '/public/images');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

var upload = multer({
    storage: Storage
});

app.post('/change', upload.single('change'), (req, res) => {
    const { colorHex } = req.body

    replaceColor({
        image: req.file.path,
        colors: {
            type: 'hex',
            targetColor: `${colorHex}`,
            replaceColor: '#FFFFFF'
        }
    }, (err, jimpObject) => {
        if (err) return console.log(err);
        let imagname = Date.now().toFixed(4) + 'output.jpg'

        jimpObject.write(`./public/images/${imagname}`, (err, data) => {
            if (err) return console.log(err)
            // console.log(data)
        })
        res.render('change', { imagepath: `images/${imagname}` })
    })
})

app.post('/upload', upload.single('image'), (req, res) => {

    var image = fs.readFileSync(
        __dirname + '/public/images/' + req.file.originalname,
        {
            encoding: null
        }
    );
    Tesseract.recognize(image)
        .progress(function (p) {
            // console.log('progress', p);
        })
        .then(function (result) {
            res.render('show', { imagepath: `images/${req.file.originalname}`, data: result.html })
            // res.send(result.html);
        });

});


app.get('/upload', (req, res) => {
    res.render('show')
});
app.get('/change', (req, res) => {
    res.render('change', { imagepath: '' })
});





module.exports = app;
