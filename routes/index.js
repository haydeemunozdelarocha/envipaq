var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var moment = require('moment');
var methodOverride = require('method-override')
moment().format();

var LocalStrategy = require('passport-local').Strategy;

var app = express();
var config = require('.././config.json')[app.get('env')];
var db = require('../db.js');

router.use(methodOverride('_method'))

var unirest = require('unirest');
var base_url = "https://connect.squareup.com/v2";


router.get('/', function(req, res, next) {
  res.render('index', { title: 'MasPost' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'MasPost'});
});

router.get('/admin/buscar', function(req, res, next) {
    var getPaquetes = "SELECT * FROM `paquetes` WHERE `entregado` = 'N'";
  db.query(getPaquetes, function(err, paquetes){
    if(err) throw err;
    else {
      console.log(paquetes);
      res.render('find', { title: 'Dashboard', paquetes: paquetes });
    }
  });
});

router.get('/admin/entregas', function(req, res, next) {
    var getPaquetes = "SELECT * FROM `paquetes` WHERE `entregado` = 'Y'";
  db.query(getPaquetes, function(err, paquetes){
    if(err) throw err;
    else {
      console.log(paquetes);
      res.render('entregas', { title: 'Dashboard', paquetes: paquetes });
    }
  });
});

router.get('/cuenta', function(req, res, next) {
  var id=req.user.usuario_id;
    var getCuenta = "SELECT * FROM `usuarios` WHERE `usuario_id` = " + id;
  db.query(getCuenta, function(err, cuenta){
    if(err) throw err;
    else {
      console.log(cuenta);
      res.render('cuenta', { title: 'Cuenta', cuenta: cuenta });
    }
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'MasPost' });
});

router.get('/admin', function(req, res, next) {
  res.render('adminlogin', { title: 'MasPost' });
});

router.put('/paquetes/entregar/:paquete', function(req, res, next) {
  var paquete = req.params.paquete;
  var date=Date.now()
  var fechaEntrega= moment(date).format('YYYY/MM/DD');
  var updateRecord = 'UPDATE paquetes SET entregado = ?, fecha_entrega= ? WHERE paquete_id=?';

db.query(updateRecord,["Y",fechaEntrega,paquete], function(err, paquete){
    console.log(paquete)
    if(err) throw err;
    else {
        console.log('Edited the project');
        res.send(paquete)
    }
  });
  });

function nuevoPaquete(req, res) {
    // Not the movie transporter!
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        auth: {
            user: 'haydeemunozdelarocha@gmail.com', // Your email id
            pass: 'Socorro000' // Your password
        }
    }));
    var text = 'Hola! Acabas de recibir un paquete. Por favor ingresa a tu cuenta para mas información.';
    var mailOptions = {
    from: 'haydeemunozdelarocha@gmail.com', // sender address
    to: 'haydee.mr0@hotmail.com', // list of receivers
    subject: 'Tu paquete ha sido recibido', // Subject line
    text: text //, // plaintext body
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);

    }else{
        console.log('Message sent: ' + info.response);
    };
});
}

function confirmacionCuenta(req, res) {
  var usuario = req.user;
  console.log(usuario);
    // Not the movie transporter!
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        auth: {
            user: 'haydeemunozdelarocha@gmail.com', // Your email id
            pass: 'Socorro000' // Your password
        }
    }));
    var text = 'Bienvenido! Hemos recibido tu suscripción. Tu nombre de usuario es: '+usuario.username+'. ';
    var mailOptions = {
    from: 'haydeemunozdelarocha@gmail.com', // sender address
    to: 'haydee.mr0@hotmail.com', // list of receivers
    subject: 'Bienvenido a Maspost', // Subject line
    text: text //, // plaintext body
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);

    }else{
        console.log('Message sent: ' + info.response);
    };
});
}

router.post('/buscar', function(req,res, next){
if(req.body.tracking){
  var tracking=req.body.tracking;
   var getPaquetes = "SELECT * FROM `paquetes` WHERE `tracking_number` = '"+tracking+"'";
   db.query(getPaquetes, function(err, paquetes){
    if(err) throw err;
    else {
      console.log(paquetes);
          res.render('find', { title: 'Dashboard', paquetes: paquetes});
          }
        });
} else if (req.body.usuario){
  var id=req.body.usuario;
    var getUsuarios = "SELECT * FROM `paquetes` WHERE `usuario` = '"+id+"'";
  db.query(getUsuarios, function(err, paquetes){
    if(err) throw err;
    else {
      console.log(paquetes);
          res.render('find', { title: 'Dashboard', paquetes: paquetes});
          }
        });
}
})


router.post('/nuevopaquete', function(req,res, next){
  console.log(req.body)
  var usuario = req.body.usuario;
  var fletera = req.body.fletera;
  var tracking_number = req.body.tracking_number;
  var peso = req.body.peso;
  var date=Date.now()
  var fecha_recepcion= moment(date).format('YYYY/MM/DD');
  var remitente= req.body.remitente;
  var precio= req.body.precio;
  var insertRecord = 'INSERT INTO paquetes(usuario,fletera,tracking_number,peso,fecha_recepcion,remitente,precio) VALUE(?,?,?,?,?,?,?)';
  console.log(usuario,fletera,tracking_number,peso,fecha_recepcion,remitente,precio)
        db.query(insertRecord,[usuario,fletera,tracking_number,peso,fecha_recepcion,remitente,precio], function(err,paquete){
            if(err) throw err;
            else {
                nuevoPaquete();
                console.log('A new paquete has been added.');
            }
          });
})

router.post('/nuevafletera', function(req,res, next){
  var nombre = req.body.nombre;
  console.log(nombre);
  var insertRecord = 'INSERT INTO fleteras(nombre) VALUE(?)';
  db.query(insertRecord,[nombre], function(err,fletera){
      if(err) throw err;
      else {
        console.log(fletera)
          console.log('A new fletera has been added.');
          res.redirect('/admin/dashboard');
      }
    });
})

router.get('/fleteras/nuevo', function(req, res, next) {
  res.render('nuevafletera', { title: 'MasPost'});
});

router.get('/paquetes/nuevo', function(req, res, next) {
  var getFleteras = "SELECT * FROM `fleteras`";
  var getUsuarios = "SELECT * FROM `usuarios`";
  db.query(getFleteras, function(err, fleteras){
    if(err) throw err;
    else {
      db.query(getUsuarios, function(err, usuarios){
        if(err) throw err;
        else {
           console.log(fleteras + "outside")
          res.render('nuevopaquete', { title: 'MasPost', fleteras: fleteras, usuarios: usuarios });
        }
     });
    }
  });
  });



router.get('/confirmation', function(req, res, next) {
  console.log('rendering confirmation')
  res.render('confirmation', { title: 'Confirmation' });
  confirmacionCuenta();
});

router.get('/admin/dashboard', function(req, res, next) {
  var getPaquetes = "SELECT * FROM `paquetes`";
  db.query(getPaquetes, function(err, paquetes){
    if(err) throw err;
    else {
      res.render('admindashboard', { title: 'Dashboard', paquetes: paquetes });
    }
  });
});

router.get('/admin/pagos', function(req, res, next) {
  var getPagos = "SELECT * FROM `pagos`";
  db.query(getPagos, function(err, pagos){
    if(err) throw err;
    else {
      console.log(pagos);
      res.render('pagos', { title: 'Dashboard', pagos: pagos });
    }
  });
});

router.get('/admin/cuentas', function(req, res, next) {
  var getPaquetes = "SELECT * FROM `usuarios`";
  db.query(getPaquetes, function(err, usuarios){
    if(err) throw err;
    else {
      console.log(usuarios);
      res.render('cuentas', { title: 'Dashboard', usuarios: usuarios });
    }
  });
});

router.get('/admin/fleteras', function(req, res, next) {
  var getPaquetes = "SELECT * FROM `fleteras`";
  db.query(getPaquetes, function(err, fleteras){
    if(err) throw err;
    else {
      console.log(fleteras);
      res.render('fletera', { title: 'Dashboard', fleteras: fleteras });
    }
  });
});

router.get('/dashboard', function(req, res, next) {
  var id = req.user.usuario_id;
  console.log(id);
  var getPaquetes = "SELECT * FROM `paquetes` WHERE `usuario` = '"+id+"'";
  db.query(getPaquetes, function(err, paquetes){
    if(err) throw err;
    else {
      console.log(paquetes);
      res.render('dashboard', { title: 'Dashboard', paquetes: paquetes });
    }
  });
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/payment',
    failureRedirect : '/signup'
}));


router.post('/admin/login', passport.authenticate('local-login', {
            successRedirect : '/admin/dashboard', // redirect to the secure profile section
            failureRedirect : '/admin'
    }));


router.post('/login', passport.authenticate('local-login', {
            successRedirect : '/dashboard', // redirect to the secure profile section
            failureRedirect : '/login'
    }));

var csrfProtection = csurf({ cookie: true })
/* GET home page. */

router.get('/payment', csrfProtection, function(req, res, next) {
    res.render('payment', { title: 'Payment', 'square_application_id': config.squareApplicationId,  form_authenticity_token: req.csrfToken() });
});


router.post('/charges/charge_card', function(req,res,next){
  console.log(req.user.usuario_id);
  console.log(req.body);
  console.log('posting')
  var location;
  var usuario_id = req.user.usuario_id;
  var request_params = req.body;
  var nombre=request_params.name;
  var email=request_params.email;
  var calle1=request_params.street_address1;
  var calle2=request_params.street_address2;
  var ciudad=request_params.city;
  var estado=request_params.state;
  var codigo_postal=request_params.zip;
  var plan=request_params.plan;
  var date=Date.now();
  var numero=req.user.usuario_id;
  var fecha_registro= moment(date).format('YYYY/MM/DD');
  var date2 = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  var vencimiento_plan= moment(date2).format('YYYY/MM/DD');
  var insertRecord = 'UPDATE usuarios SET nombre = ?, email = ?, calle1 = ?, calle2 = ?, ciudad = ?, estado = ?, codigo_postal = ?, plan = ?, fecha_registro = ?, vencimiento_plan = ?, numero = ? WHERE usuario_id = ?';
  db.query(insertRecord,[nombre,email,calle1,calle2,ciudad,estado,codigo_postal,plan,fecha_registro,vencimiento_plan,numero, usuario_id], function(err,usuario){
      if(err) throw err;
      else {
        console.log(usuario)
          console.log('A new cuenta has been added.');
      }
    });
  unirest.get(base_url + '/locations')
  .headers({
    'Authorization': 'Bearer ' + config.squareAccessToken,
    'Accept': 'application/json'
  })
  .end(function (response) {
    location = response.body.locations[0];
    console.log(response.body.locations)

    var token = require('crypto').randomBytes(64).toString('hex');

    //Check if product exists
    // if (!product_cost.hasOwnProperty(request_params.product_id)) {
    //   console.log(product_id)
    //   return res.json({status: 400, errors: [{"detail": "Product Unavailable"}] })
    // }

    // Make sure amount is a valid integer
    var amount = 100;

    request_body = {
      card_nonce: request_params.nonce,
      amount_money: {
        amount: amount,
        currency: 'USD'
      },
      idempotency_key: token
    }
    var usuario=request_params.name;
      console.log(usuario);
    var monto = amount;
      console.log(monto);
    var plan=request_params.plan;
    var fecha= moment(date).format('YYYY/MM/DD');
    var insertPayment = 'INSERT INTO pagos(usuario,monto,fecha,plan) VALUE (?,?,?,?)';
    console.log(usuario,monto,fecha,plan)
      db.query(insertPayment,[usuario,monto,fecha,plan], function(err,pago){
          if(err) throw err;
          else {
            console.log(pago)
              console.log('A new pago has been added.');
          }
        });
    // unirest.post(base_url + '/locations/' + location.id + "/transactions")
    // .headers({
    // 'Authorization': 'Bearer ' + config.squareAccessToken,
    // 'Accept': 'application/json',
    // 'Content-Type': 'application/json'
    // })
    // .send(request_body)
    // .end(function(response){
    //   if (response.body.errors){
    //     console.log(response.body.errors)
    //     res.redirect('/')
    //   }else{
        console.log('success')
        res.redirect('/confirmation')
    //   }
    // })

  });
});

module.exports = router;
