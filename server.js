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
     var sql = 'select * from users';
     if(id){
         sql += ' where id=' + id + 'order by id ASC';
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
    var sql = 'select * from products';
    db.any(sql)
    .then(function(data){
        console.log('DATA :' + data);
        res.render('pages/products',{products :data})
    })
    .catch(function(error){
        console.log('ERROR :' + error);
    })
    });


//เพิ่ม routing of product
app.get('/products/:pid',function(req,res){  
    //เอาidproductมาเตรียมเพื่อจะsaveต่อไป
    var pid = req.params.pid;
    var sql = "Select * from products where id =" + pid;
    db.any(sql)
    .then(function(data){ 
        res.render('pages/product_edit',{product :data[0]})
    })
    .catch(function(error){
        console.log('ERROR :' + error);
    })
});


//routing of update product edit data
app.post('/product/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update products set title = '${title}',price = '${price}' where id = '${id}' `;
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});


//routing of delete products data
app.get('/product_delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'DELETE FROM products';
    if (id) {
        sql += ' where id =' + id;
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
app.post('/products/addnewpro',function(req,res){
    var id =req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `INSERT INTO products (id,title,price) VALUES ('${id}','${title}' ,'${price}')`;
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
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    res.render('pages/addnewpro', { time: time});
    
});

//เพิ่ม routing of user
app.get('/users/:id',function(req,res){  
    var id = req.params.id;
    var sql = "Select * from users where id =" + id ;
    db.any(sql)
    .then(function(data){ 
        res.render('pages/user_edit',{user :data[0]})
    })
    .catch(function(error){
        console.log('ERROR :' + error);
    })
});
//routing of update users edit data
app.post('/user/update', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var sql = `update users set email = '${email}', password = '${password}' where id = '${id}' `;
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users')
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

//routing of delete users data
app.get('/user_delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'DELETE from users';
    if (id) {
        sql += ' where id =' + id;
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
    var sql = `INSERT INTO users (id,email,password) VALUES ('${id}','${email}' ,'${password}')`;
    db.any(sql)
    .then(function(data){
        res.redirect('/users')
    })
    .catch(function(data){
        console.log('ERROR :'+ error);
    })
});
app.get('/addnewuser',function(req,res){
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    res.render('pages/addnewuser', { time: time});
    
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});
