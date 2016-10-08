
var express = require('express'),
    bodyParser= require('body-parser'),
    app = express(),
    mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://dbuser:password@ds035766.mlab.com:35766/crmdb');
var db = mongoose.connection;
db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
    app.listen(port, function () {
      console.log( "Listening on port " + port )
    });
    console.log('Server is running');
});

// Schemas

var Schema = mongoose.Schema;

var Item = new Schema({
    art: { type: String, required: true},
    name: { type: String, required: true},
    price: { type: Number, required: true},
    quantity: { type: Number, default: 0},
    debt: { type: Number, default: 0},
    ordered: { type: Number, default: 0},
    category: { type: String, default: ''}
});

var Partner = new Schema({
    name: String,
    fullname: String,
    contact: String,
    person: String,
    type: String
})

var Sale = new Schema({
    date: { type: Date, default: Date.now },
    number: { type: Number, unique: true, required: true},
    customer: Partner,
    items: [{id: String, number: Number, price: Number}],
    sum: { type: Number, default: 0},
    manager: { type: Object, required: true},
    state: { type: String, default: 'new'}
});

var ItemModel = mongoose.model('Item', Item);

var SaleModel = mongoose.model('Sale', Sale);

var PartnerModel = mongoose.model('Partner', Partner);

// READ

app.get('/stock/read', function (req, res) {
    readHandler(ItemModel,req,res);
});

app.get('/partners/read', function (req, res) {
    readHandler(PartnerModel,req,res);
});

app.get('/sales/read', function (req, res) {
    readHandler(SaleModel,req,res);
});

function readHandler(Model,req,res) {
    return Model.find(function (err,items) {
        if (!err) {
            return res.send(items);
        } else {
            res.statusCode = 500;
            return res.send({ error: 'Server error 500' });
        }
    })
};


// CREATE

app.post('/stock/create', function (req, res) {
    var item = new ItemModel({
        art: req.body.art,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
    });

    createHandler(item,res,'item');
});

app.post('/sales/create', function (req, res) {
    var sale = new SaleModel({
        number: req.body.number,
        customer: req.body.customer,
        items: req.body.items,
        sum: req.body.sum,
        manager: req.body.manager
    });

   createHandler(sale,res,'sale');
});

app.post('/partners/create', function (req, res) {
    var partner = new PartnerModel({
        name: req.body.name,
        fullname: req.body.fullname,
        contact: req.body.contact,
        person: req.body.person,
        type: req.body.type,
    });

    createHandler(partner,res,'partner');
});

function createHandler(item,res,str) {
    item.save(function (err) {
        if (!err) {
            console.log(str+" created");
           return res.send({ status: 'OK', item:item });
        } else {
            console.log(err);
        }
    });
};


// UPDATE

app.put('/stock/update/:id', function (req, res){
   updateHandler(ItemModel,req,res,'item');
});
app.put('/sales/update/:id', function (req, res){
    updateHandler(SaleModel,req,res,'sale');
});

app.put('/partners/update/:id', function (req, res){
    updateHandler(PartnerModel,req,res,'partner');
});

function updateHandler(Model,req,res,str) {
    return Model.findById(req.params.id, function (err, item) {
        if(!item) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        for (var key in req.body) {
            item[key] = req.body[key];
        }
        return item.save(function (err) {
            if (!err) {
                console.log(str+" updated");
                return res.send({ status: 'OK', item:item });
            } else {
                console.log(err);
            }
        });
    });
};


// DELETE

app.delete('/stock/delete/:id', function (req, res){
    deleteHandler(ItemModel,req,res,'item');
});

app.delete('/sales/delete/:id', function (req, res){
    deleteHandler(SaleModel,req,res,'sale');
});

app.delete('/partners/delete/:id', function (req, res){
    deleteHandler(PartnerModel,req,res,'partner');
});

function deleteHandler(Model,req,res,str) {
    return Model.findById(req.params.id, function (err, item) {
        if(!item) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return item.remove(function (err) {
            if (!err) {
                console.log(str+" removed");
                return res.send({ status: 'OK' });
            } else {
                console.log(err);
            }
        });
    });
};


