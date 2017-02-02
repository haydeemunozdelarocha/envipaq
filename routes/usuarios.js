var express = require('express');
var router = express.Router();
var db = require('../db.js');


var readTable = 'SELECT * FROM usuarios';
var updateRecord = 'UPDATE usuarios SET nombre = ? email = ? calle1 = ? calle2 = ? ciudad = ? estado = ? codigo_postal = ? plan = ? fecha_registro = ? vencimiento_plan = ? numero = ? WHERE usuario_id = ?';
var deleteRecord = 'DELETE FROM usuarios WHERE usuario_id=?';

router.get('/', function(err,res){
    db.query(readTable, function(err, rows){
    if(err) throw err;
    else {
        res.send(rows);
    }
  });
})

  //Update a record.
router.put('/:id', function(req,res,err){
  var nombre = req.body.nombre;
  var email = req.body.email;
  var calle1 = req.body.calle1;
  var calle2 = req.body.calle2;
  var ciudad = req.body.ciudad;
  var estado = req.body.estado;
  var codigo_postal = req.body.codigo_postal;
  var plan = req.body.plan;
  var fecha_registro = req.body.fecha_registro;
  var vencimiento_plan = req.body.vencimiento_plan;
  var numero = req.body.numero;
  var usuario_id = req.params.id;
    db.query(updateRecord,[nombre,email,calle1,calle2,ciudad,estado,codigo_postal,plan,fecha_registro,vencimiento_plan,numero,usuario_id], function(err, usuario){
    if(err) throw err;
    else {
        console.log('Usuario editado.');
        res.send(usuario)
    }
  });
})



  //Delete a record.
router.get('/borrar/:id', function(req,res,err){
  var usuario_id = req.params.id;
  console.log(usuario_id)
  db.query(deleteRecord,[usuario_id], function(err, res){
    console.log(deleteRecord)
    if(err) throw err;
    else {
        console.log('Usuario eliminado.');
    }
  });
})
module.exports = router;
