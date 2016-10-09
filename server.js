
var express = require('express'),
    bodyParser= require('body-parser'),
    app = express(),
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: 'dammitdrum',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ 
        url: 'mongodb://dbuser:password@ds053156.mlab.com:53156/crmusers',
    })
}))

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

var User = new Schema({
    login: { type: String, unique: true, required: true},
    name: { type: String},
    password: { type: String, required: true},
    access: { type: String, required: true}
})

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

var Order = new Schema({
    date: { type: Date, default: Date.now },
    number: { type: Number, unique: true, required: true},
    supplier: Partner,
    items: [{id: String, number: Number, price: Number}],
    sum: { type: Number, default: 0},
    state: { type: String, default: 'new'}
});

var UserModel = mongoose.model('User', User);

var ItemModel = mongoose.model('Item', Item);

var SaleModel = mongoose.model('Sale', Sale);

var OrderModel = mongoose.model('Order', Order);

var PartnerModel = mongoose.model('Partner', Partner);

function hash(text) {
    return crypto.createHash('sha1')
    .update(text).digest('base64')
}

app.post('/auth', function(req, res, next) {
    if (req.session.user) {
        console.log(req.session)
        return res.send(req.session.user);
    } else {
        return res.send('noAuth');
    }
})

app.post('/login', function(req, res, next) {
    UserModel.findOne({login:req.body.login}).then(function(user) {
         if (user.password === hash(req.body.password)) {
            console.log("User password is ok");
            req.session.user = {
                id: user._id, 
                login: user.login,
                name: user.name,
                access: user.access
            }
            return res.send({ status: 'OK', session:req.session.user });
        } else {
            console.log("Error auth");
            res.send("Error auth");
        }
    })
 
});
 
app.post('/user/create', function(req, res) {
    var user = new UserModel({
        login: req.body.login,
        name: req.body.name,
        password: hash(req.body.password),
        access: req.body.access
    });
    user.save(function(err) {
        if (!err) {
            console.log("User created");
            return res.send({ status: 'OK', user:user });
        } else {
            if (err.code == 11000){
                res.status(500).send("This user already exist")
            };
        }
    });
});
 
app.post('/logout', function(req, res, next) {
    if (req.session.user) {
        delete req.session.user;
    }
});

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
app.get('/orders/read', function (req, res) {
    readHandler(OrderModel,req,res);
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
app.post('/orders/create', function (req, res) {
    var order = new OrderModel({
        number: req.body.number,
        supplier: req.body.supplier,
        items: req.body.items,
        sum: req.body.sum
    });

   createHandler(order,res,'order');
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
app.put('/orders/update/:id', function (req, res){
    updateHandler(OrderModel,req,res,'order');
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
app.delete('/orders/delete/:id', function (req, res){
    deleteHandler(OrderModel,req,res,'order');
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


