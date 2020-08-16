const express = require('express');
const expressIp = require('express-ip');
const app = express();
const mongoose = require('mongoose');
const Shortened = require('./models/shortened');

try{
    mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
        console.log('Connected to DB!');
    })
}
catch(err){
    console.log('DB connection error! ' + err);
}

app.set('view engine', 'ejs');

app.use(expressIp().getIpInfoMiddleware);
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));

app.get('/', async (req, res) => {
    const host = req.get('host');
    const yourLinks = await Shortened.find({ip: req.ipInfo.ip});
    res.render('index', {yourLinks: yourLinks, host: host});
})

app.post('/', async (req, res) => {
    try{
        const savedURL = new Shortened({
            ip: req.ipInfo.ip,
            link: req.body.link
        })
        await savedURL.save();
        res.redirect('/');
    }
    catch(err){
        console.log(err)
    }   
})

app.get('/:id', async (req, res) => {
    const id = req.params.id;
    const shortened = await Shortened.findOne({shortid: id});
    shortened ? res.redirect(shortened.link) : res.status(404).render('404');
})

app.listen(process.env.PORT || 3000, () => console.log(`App running on port ${process.env.PORT || 3000}!`));
