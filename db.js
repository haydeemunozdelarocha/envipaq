var mysql = require('promise-mysql');


var db_config      =    mysql.createPool({
    connectionLimit : 150, //important
    host     : process.env.MASPOST_DB_HOST,
    user     : process.env.MASPOST_DB_USER,
    password : process.env.MASPOST_DB_PSS,
    database : 'heroku_b6e69546b135d2b',
    debug    :  false,
    multipleStatements: true,
    queueLimit: 50,
    acquireTimeout:1000000,
    connectTimeout:0
});
console.log(process.env.DB_HOST)
var conn;
function handle_database() {
  console.log('connecting')
db_config.getConnection().then(function(connection) {
    conn = connection;
    return connection;
  }).catch(function(error) {
    console.log("Connect failed", error);
   setTimeout(handleDisconnect, 2000);
   return
  })
}

// db_config.on('error', function(err) {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') {
//       handleDisconnect();
//       console.log('reconnecting')
//     } else if(err.code === 'ECONNREFUSED'){
//       console.log(err.code)
//       handleDisconnect();
//     } else if(err.code === 'ER_BAD_FIELD_ERROR'){
//       console.log(err.code)
//       db_config.end();
//       handleDisconnect();
//     } else if(err.code === 'ER_USER_LIMIT_REACHED'){
//       console.log(err.code)
//       handleDisconnect();
//     }else {
//       handleDisconnect();
//     }
//   });


function handleDisconnect(res,req,err) {
console.log('reconnecting...')
handle_database()
}

handle_database();

function disconnect() {
  db_config.end(function onEnd(error) {
  console.log('ending connection')
  db.end()
  if (error) throw error;
  // All connections are now closed once they have been returned with connection.release()
  // i.e. this waits for all consumers to finish their use of the connections and ends them.
});
}



module.exports = db_config;
