//หน้าwebstie
var express = require('express');
var pgp = require('pg-promise')();
//var db = pgp(process.env.DATABSAE_URL);
var db = pgp('postgres://rzbthrbqjwrmnt:2982f8c701fb3cf462209cfed528dcc6678f92fc009079ce9e05f8d00ff61b24@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d4kvflfh1d13co?ssl=true');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var moment = require('moment');
moment().format();

app.set('view engine', 'ejs');

app.get('/',function(req,res){
    res.render('pages/index');
});

app.get('/index',function(req,res){
    res.render('pages/index');
});

app.get('/index/products',function(req,res){
    res.render('pages/index');
});

app.get('/about',function(req,res){
    var name = 'Nisarat';
    var hobbies = ['Music','Movie','Programming'];
    var bdate = '12/07/1997';
    res.render('pages/about',{ fullname : name , hobbies : hobbies , bdate : bdate });
});


//Display all users id
app.get('/users',function(req,res){
     var id= req.param('id');
     var sql = 'select * from users order by user_id ASC';
     if(id){
         sql += ' where user_id =' + id + ' order by user_id ASC';
     }
     db.any(sql)
     .then(function(data){
        console.log('DATA :' + data);
        res.render('pages/users',{users :data})
     })
     .catch(function(error){
        console.log('ERROR :' + error);
     })
 });

//Display all products แบบธรรมดา
app.get('/products',function(req,res){
    var id= req.param('id');
    var sql = 'select * from products order by product_id ASC';
    if(id){
        sql += ' where product_id=' + id + 'order by product_id ASC';
    }
    db.any(sql)
    .then(function(data){
        console.log('DATA :' + data);
        res.render('pages/products',{products :data})
    })
    .catch(function(error){
        console.log('ERROR :' + error);
    })
    });


//เพิ่ม routing of product pid
app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from products where product_id =" + pid;
    db.any(sql)
        .then(function (data) {
            res.render('pages/product_edit', { product: data[0],time: time});
        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);
        })
});

//เพิ่ม routing of user pid
app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    var times = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from users where user_id =" + id;
    db.any(sql)
        .then(function (data) {
            res.render('pages/user_edit', { user: data[0],time: times});
        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);
        })
});

//routing of update product edit data
app.post('/product/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update products set title ='${title}',price= '${price}'  where product_id = '${id}'`;
    db.query(sql)
        .then(function (data) {
            res.redirect('/products')

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});


//routing of delete products data
app.get('/product_delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'DELETE FROM products';
    if (id) {
        sql += ' where product_id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products');

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});


//routing of insert data addnewpro.ejs
app.post('/product/addnewpro',function(req,res){
    var id =req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var time = req.body.time;
    var sql = `INSERT INTO products (product_id,title,price,created_at) VALUES ('${id}','${title}' ,'${price}','${time}')`;
    console.log('UPDATE:' + sql);
    db.any(sql)
    .then(function(data){
        res.redirect('/products')
    })
    .catch(function(data){
        console.log('ERROR :'+ error);
    })
});

app.get('/addnewpro',function(req,res){
    var time = moment().format();
    res.render('pages/addnewpro',{time: time});
});

//routing of update users edit data
app.post('/users/update', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var sql = `update users set email ='${email}',password= '${password}'  where user_id = '${id}'`;
    db.query(sql)
        .then(function (data) {
            res.redirect('/users')

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});

//routing of delete users data
app.get('/user_delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'DELETE from users';
    if (id) {
        sql += ' where user_id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

//routing of insert data addnewuser.ejs
app.post('/user/addnewusers',function(req,res){
    var id =req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var time = req.body.time;
    var sql = `INSERT INTO users (user_id,email,password,created_at) VALUES ('${id}','${email}' ,'${password}','${time}')`;
    db.any(sql)
    .then(function(data){
        res.redirect('/users')
    })
    .catch(function(data){
        console.log('ERROR :'+ error);
    })
});

app.get('/addnewuser',function(req,res){
    var time = moment().format();
    res.render('pages/addnewuser',{time: time});
});

//report product
app.get('/purchases_item', function(req, res){
    var sql ='select products.product_id,products.title,sum(purchase_items.quantity) as quantity,sum(purchase_items.price) as price from products inner join purchase_items on purchase_items.product_id=products.product_id group by products.product_id;select sum(quantity) as squantity,sum(price) as sprice from purchase_items';
    db.multi(sql)
    .then(function  (data) 
    {
 
        // console.log('DATA' + data);
        res.render('pages/purchases_item', { item: data[0],sum: data[1]});
    })
    .catch(function (data) 
    {
        console.log('ERROR' + error);
    })

});
app.get('/purchases', function(req, res) {
    var sql='select users.email,purchases.name,products.title,purchase_items.quantity,purchase_items.price*purchase_items.quantity as tatol FROM users INNER JOIN purchases ON purchases.user_id = users.user_id INNER JOIN purchase_items ON purchase_items.purchase_id=purchases.purchase_id   INNER JOIN products ON products.product_id = purchase_items.product_id order by purchase_items.price*purchase_items.quantity DESC limit 25'
    db.any(sql)
        .then(function (data) 
        {
            console.log('DATA' + data);
            res.render('pages/purchases', {purchases: data});
        })
        .catch(function (data) 
        {
            console.log('ERROR' + error);
        })
});
var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});
