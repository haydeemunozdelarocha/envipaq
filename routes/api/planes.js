var express = require('express');
var router = express.Router();
var db = require('../../db.js');

var insertRecord = 'INSERT INTO servicios(nombre,precio) VALUE(?,?)';
var readTable = 'SELECT * FROM servicios';
var updateRecord = 'UPDATE servicios SET nombre = ? precio =? WHERE id=?';
var deleteRecord = 'DELETE FROM servicios WHERE nombre=?';


//add obra
router.post('/', function(req,res, next){

  db.query(insertRecord,["super", 100], function(err,servicio){
      if(err) throw err;
      else {
          console.log('A new service has been added.');
          res.redirect('/');
      }
    });
})

//Read table.
router.get('/', function(err,res){
    db.query(readTable, function(err, rows){
    if(err) throw err;
    else {
        res.send(rows);
    }
  });
})

router.get('/:id', function(req, res, next ){
  var id= req.params.id;
  var getRecord = "SELECT * FROM `obras` WHERE `idobras` = "+id+"";
  db.query(getRecord, function(err, obra){
    if(err) throw err;
    else {
        console.log('Getting the project');
        res.send(obra)
    }
  });
})

  //Update a record.
router.put('/:idobras', function(err,res){
  var nombre = req.body.nombre;
  var codigo = req.body.codigo;
    db.query(updateRecord,[nombre,codigo], function(err, obra){
    if(err) throw err;
    else {
        console.log('Edited the project');
        res.send(obra)
    }
  });
})



  //Delete a record.
router.delete('/:idobras', function(err,res){
  db.query(deleteRecord,['Joe'], function(err, res){
    if(err) throw err;
    else {
        console.log('An employee is removed.');
    }
  });
})

module.exports = router;


