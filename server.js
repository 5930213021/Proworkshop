//หน้าwebstie
var express = require('express');
var pgp = require('pg-promise')();
var db = pgp('postgres://nkwnjxuiidwrns:b72b4de42f726173c9acee8a85dd10ed1c8dc1a2ab7402a6feebbbccb8b14f85@ec2-54-163-245-44.compute-1.amazonaws.com:5432/d34ii1v5fr4h1e?ssl=true');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//กลไลบอกชื่อserver โดยการส่งข้อความไป (/) คือ URL
/*app.get('/',function(require,response){
    response.send('Hello, Express');
});
app.get('/test',function(require,response){
    response.send('<H1>Test</H1>');
}); */

//app.use(express.static('static'));
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

//Display all products แบบธรรมดา
app.get('/products',function(req,res){
    var sql = 'select * from products';
    db.any(sql)
    .then(function(data){
        console.log('DATA :' + data);
        //res.json(data);
        res.render('pages/products',{products :data})
    })
    .catch(function(error){
        console.log('ERROR :' + error);
    })
    });

//เพิ่ม routing of product
app.get('/products/:pid',function(req,res){
    // console.log("GET: " + req.params.pid);
    // res.end();
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

//Display all users
app.get('/users',function(req,res){
    //res.download('static/index.html');
     var id= req.param('id');
     var sql = 'select * from users';
     if(id){
         sql += ' where id=' + id;
     }
     db.any(sql)
     .then(function(data){
         console.log('DATA :' + data);
         //res.json(data);
         res.render('pages/users',{users :data})
     })
     .catch(function(error){
         console.log('ERROR :' + error);
     })
 });

//Display all users id
app.get('/users/:id',function(req,res){
    //res.download('static/index.html');
    var id = req.params.id;
    var sql = 'select * from users';
    if(id){
        sql += ' where id =' + id;
    }
    db.any(sql)
    .then(function(data){
         console.log(data);
         //res.json(data);
         res.render('pages/users',{users :data})
    })
     .catch(function(error){
         console.log('ERROR :' + error);
    })
 });

//routing of update data
app.post('/product/update',function(req,res){
    var id =req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `Update product set title = ${title}, price = ${price} where id =${id}`;
    console.log('UPDATE:' +sql);
    res.redirect('/products'); 
    res.send(sql);

});

// console.log('App is running at http://localhost:8080');
// app.listen(8080); //8080 ไว้สำหรับtest app

var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});
