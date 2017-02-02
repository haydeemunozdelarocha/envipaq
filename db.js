var mysql = require('promise-mysql');


var db_config      =    mysql.createPool({
    connectionLimit : 150, //important
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'b4e1e2c94d4362',
    password : 'a70021e8',
    database : 'heroku_b6e69546b135d2b',
    debug    :  false,
    multipleStatements: true,
    acquireTimeout:1000000,
    connectTimeout:0
});
var conn;
function handle_database(req,res) {
  console.log('connecting')
db_config.getConnection().then(function(connection) {
    conn = connection;
    return connection;
  }).catch(function(error) {
    console.log("Connect failed", error);
   setTimeout(handleDisconnect, 2000);
   return
  }).finally(function() {
    if (conn) {
      console.log('done using connection')
      return
    }
  });
  console.log('Conectado');
}


db_config.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();
      console.log('reconnecting')                       // lost due to either server restart, or a
    } else if(err.code === 'ECONNREFUSED'){
      console.log(err.code)
      handleDisconnect();
    } else if (err.code === 'ER_USER_LIMIT_REACHED'){
      console.log(err.code)
      handleDisconnect();
    }else {                           // connnection idle timeout (the wait_timeout
      handleDisconnect();                                // server variable configures this)
    }
  });

function handleDisconnect() {
console.log('reconnecting...')
db_config.getConnection(function(err){
  if(err){
    console.log('No se pudo conectar a la base de datos');
    handle_database();
    return;
  }
  console.log('Conectado');
});
}

handle_database();




module.exports = db_config;
