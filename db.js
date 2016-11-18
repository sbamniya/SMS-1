var mySQL = require('mysql');
    var pool  = mySQL.createPool({
        host:  'us-cdbr-iron-east-04.cleardb.net',
        user:'bb39ff20f0d292',
        password:'5bb4dbd4',
        database:'heroku_d8d5555185d6320'
    });
    
    module.exports = pool;