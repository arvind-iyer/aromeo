var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var loki = require('lokijs');

app.use(bodyParser.json());

var db = new loki('tasks.db');
var tasks = db.getCollection('tasks');
if(tasks==null) {
    tasks = db.addCollection('tasks');
}

app.get('/', function(req,res) {
    res.type('text/plain');
    res.send('Aromeo!');
});

app.get('/tasks', function(req,res) {
    res.json(tasks.find());
});


app.get('/tasks/:id', function(req,res) {
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
