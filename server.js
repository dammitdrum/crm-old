
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

// Schemas

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

var Customer = new Schema({
    number: Number,
    name: String,
    contact: String,
    person: String,
})

var Sale = new Schema({
    date: { type: Date, default: Date.now },
    number: { type: Number, unique: true, required: true},
    customer: Customer,
    items: [{id: String, number: Number}],
    sum: { type: Number, default: 0},
    manager: { type: Object, required: true},
    state: { type: String, default: 'new'}
});



var ItemModel = mongoose.model('Item', Item);

var SaleModel = mongoose.model('Sale', Sale);


// READ

app.get('/stock/read', function (req, res) {
    return ItemModel.find(function (err, items) {
        if (!err) {
            return res.send(items);
        } else {
            res.statusCode = 500;
            return res.send({ error: 'Server error 500' });
        }
    });
});

app.get('/stock/read/:id', function (req, res) {
    res.send(req.params.id);
});

app.get('/sales/read', function (req, res) {
    return SaleModel.find(function (err, sales) {
        if (!err) {
            return res.send(sales);
        } else {
            res.statusCode = 500;
            return res.send({ error: 'Server error 500' });
        }
    });
});

app.get('/sales/read/:id', function (req, res) {
    res.send(req.params.id);
});


// CREATE

app.post('/stock/create', function (req, res) {
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

app.post('/sales/create', function (req, res) {
    var sale = new SaleModel({
        number: req.body.number,
        customer: req.body.customer,
        items: req.body.items,
        sum: req.body.sum,
        manager: req.body.manager,
    });

    sale.save(function (err) {
        if (!err) {
            console.log("sale created");
            return res.send({ status: 'OK', sale:sale });
        } else {
            console.log(err);
        }
    });
});


// UPDATE

app.put('/stock/update/:id', function (req, res){
    return ItemModel.findById(req.params.id, function (err, item) {
        if(!item) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        for (var key in req.body) {
            item[key] = req.body[key];
        }
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


// DELETE

app.delete('/stock/delete/:id', function (req, res){
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


