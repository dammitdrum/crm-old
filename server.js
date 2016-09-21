
var express = require('express'),
    bodyParser= require('body-parser'),
    app = express(),
    mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/front'));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://dbuser:password@ds035766.mlab.com:35766/crmdb');
var db = mongoose.connection;
db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
    app.listen(1337);
    console.log('Server is running');
});

var Schema = mongoose.Schema;

var Item = new Schema({
    art: { type: String, required: true},
    name: { type: String, required: true},
    price: { type: Number, required: true},
    quantity: { type: Number, default: 0},
    reserve: { type: Number, default: 0},
    ordered: { type: Number, default: 0},
    category: { type: String, default: ''}
});

var ItemModel = mongoose.model('Item', Item);

app.get('/api/read', function (req, res) {
    return ItemModel.find(function (err, items) {
        if (!err) {
            return res.send(items);
        } else {
            res.statusCode = 500;
            return res.send({ error: 'Server error 500' });
        }
    });
});

app.post('/api/create', function (req, res) {
    console.log(req.body);

    var item = new ItemModel({
        art: req.body.art,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
    });

    item.save(function (err) {
        if (!err) {
            console.log("item created");
            return res.send({ status: 'OK', item:item });
        } else {
            console.log(err);
        }
    });
});

app.get('/api/read/:id', function (req, res) {
    res.send(req.params.id);
});

app.put('/api/update/:id', function (req, res){
    return ItemModel.findById(req.params.id, function (err, item) {
        if(!item) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        item.art = req.body.art;
        item.name = req.body.name;
        item.price = req.body.price;
        item.category = req.body.category;
        item.quantity = req.body.quantity;
        item.reserve = req.body.reserve;
        item.ordered = req.body.ordered;
        return item.save(function (err) {
            if (!err) {
                console.log("item updated");
                return res.send({ status: 'OK', item:item });
            } else {
                console.log(err);
            }
        });
    });
});

app.delete('/api/delete/:id', function (req, res){
    return ItemModel.findById(req.params.id, function (err, item) {
        if(!item) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return item.remove(function (err) {
            if (!err) {
                console.log("item removed");
                return res.send({ status: 'OK' });
            } else {
                console.log(err);
            }
        });
    });
});
