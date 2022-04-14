const express=require('express');
const session=require('express-session');
const bodyParser=require('body-parser');
const path=require('path');
const mysql=require('mysql');

var connection=mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'login'
});

var app=express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/login.html'));
});

app.post('/auth', (req, res) => {
    var username=req.body.username;
    var password=req.body.password;
    if(username && password){
        connection.query('SELECT * FROM accounts WHERE username=? AND password=?', [username, password], function(error, results, fields){
            if(results.length>0){
                req.session.loggedin=true;
                req.session.username=username;
                res.redirect('/home');
            }else{
                res.send('Error 1');
                res.end();
            }
        });
    }else{
        res.send('Error 2');
        res.end();
    }
});

app.get('/home', (req, res) => {
    if(req.session.loggedin){
        res.send('Bienvenido a tu session: ' + req.session.username + ' Con ruta /Home');
    }else{
        res.send('Error 3');
    }
    res.end();
});

app.listen(3000, () => {
    console.log('Server on port: 3000');
});

