var express = require('express');
var bp=require('body-parser');
var _=require('underscore');

var app = express();
var pid=1;

var pendingtasks=[];

app.use(bp.json());

app.post('/postmydata',function(req,res) {
    var body=req.body;
    body.id=pid++;
    pendingtasks.push(body);
    res.json(body);
})

app.use(express.static('public'))

app.get('/showmydata',function(req,res){
    res.json(pendingtasks);
});
app.get('/showmydata/:id',function(req,res){
    var todoId=parseInt(req.params.id,10);
    var matchedTodo = _.findWhere(pendingtasks,{id:todoId}); 

    if(matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

app.delete('/deletemydata/:id',function(req,res){
    var todoId=parseInt(req.params.id,10);
    var matchedTodo = _.findWhere(pendingtasks,{id:todoId}); 

    if(matchedTodo) {
        pendingtasks=_.without(pendingtasks,matchedTodo);
        res.json(matchedTodo);
    } else {
        res.status(404).json({"Error":"Id not found"});
    }
});

app.listen(3000,function() {
    console.log('Server is Started !!!');
});