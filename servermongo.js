var express = require('express');
var bp=require('body-parser');
var _=require('underscore');
var MongoClient=require('mongodb').MongoClient;
var cluster=require('cluster');
var app = express();

var db

if(cluster.isMaster) {
    var cpuCount=require('os').cpus().length;

    for(var i=0;i<cpuCount;i++) {
        cluster.fork();
    }
} else {

MongoClient.connect('mongodb://admin:admin@ds161021.mlab.com:61021/atisdb',(err,database)=> {
    if(err) return console.log(err)
    db=database;
})

var pid=1;
var pendingtasks=[];

app.use(bp.json());

app.post('/postmydata',(req,res) => {
    db.collection('mytasks').save(req.body , (err,result) => {
        if(err) return console.log(err)
        console.log('Saved to DB');
    })
});

app.get('/showmydata',(req,res) => {
     db.collection('mytasks').find().toArray((err,result) => {
        if(err) return console.log(err)
        res.json(result);
    })
});

app.delete('/deletemydata',(req,res)=>{
    db.collection('mytasks').findOneAndDelete({name:req.body.name},(err,result) => {
        if(err) return console.log(err)
        res.send('Record Deleted');
    })
});
}

app.listen(3000,function() {
    console.log('Server is Started !!!');
});

