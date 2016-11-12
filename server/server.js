var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = requier('monk');

var app = express();

app.use(bodyParser.json());

//Make database accessible to router
app.use(function(req,res,next){
    req.db = db;
    next();
});


//var db = new loki('tasks.db');
const db = monk(process.env.MONGODB_URI || "mongodb://localhost:27017/aromeo");
const tasks = db.get('tasks');


// var tasks = db.getCollection('tasks');
// if(tasks==null) {
//     tasks = db.addCollection('tasks');
// }
//db.saveDatabase();
app.get('/', function(req,res) {
    res.type('text/plain');
    res.send('Aromeo!');
});

app.get('/tasks', function(req,res) {

    tasks.find({}, {}, function(e, data) {
        res.json(data);
    });
});


app.get('/tasks/:id', function(req,res) {
    tasks.count(function(err, count) {
        if(count > req.params.id && req.params.id >= 0) {
            //res.json(tasks.get)
            res.statusCode = 404;
            return res.send('Error 404: No task found');
        }

    });
    if(tasks.count() <= req.params.id || req.params.id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No task found');
    }
    res.json(tasks.get(req.params.id));
});

app.post('/tasks', function(req,res) {
    if(!req.body.hasOwnProperty('description') ||
       !req.body.hasOwnProperty('title') ||
       !req.body.hasOwnProperty('crontime') ) {
        res.statusCode = 400;
        return res.send('Error 400: POST syntax incorrect. Check if all required data fields have been defined');
    }
    var newTask = {
        description : req.body.description,
        title : req.body.title,
        crontime : req.body.crontime
    };

    tasks.insert(newTask);
    db.saveDatabase();
    res.json(true);
});

app.delete('/tasks/:id', function(req, res) {
    if(tasks.count() <= req.params.id) {
        res.statusCode = 404;
        return res.send('Error 404: No quote found');
    }
    //console.log(quote_col.get(req.params.id));
    tasks.remove(tasks.get(req.params.id));
    db.saveDatabase();
    res.json(true);
});


app.listen(process.env.PORT || 6789);
