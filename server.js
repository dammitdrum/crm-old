
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

var Order = new Schema({
    date: { type: Date, default: Date.now },
    number: { type: String, required: true},
    customer: { type: Object, required: true},
    items: [Item],
    sum: { type: Number, default: 0},
    manager: { type: Object, required: true},
    state: { type: String, default: 'new'}
});

var ItemModel = mongoose.model('Item', Item);

var OrderModel = mongoose.model('Order', Order);


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

app.get('/orders/read', function (req, res) {
    return OrderModel.find(function (err, orders) {
        if (!err) {
            return res.send(orders);
        } else {
            res.statusCode = 500;
            return res.send({ error: 'Server error 500' });
        }
    });
});

app.get('/orders/read/:id', function (req, res) {
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

app.post('/orders/create', function (req, res) {
    var order = new ItemModel({
        number: req.body.number,
        customer: req.body.customer,
        items: req.body.items,
        manager: req.body.manager,
    });

    order.save(function (err) {
        if (!err) {
            console.log("order created");
            return res.send({ status: 'OK', order:order });
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


