const mysql = require('mysql')
const config = require('../config.json')

module.exports = {
    connect: async function(){
        con = mysql.createConnection({
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database
        })
        con.connect(function(err) {
            if (err) throw err
        })
    },

    request : async function(query){
        if(config.debug) console.log("Database: " + query)
        return new Promise((resolve, reject) => {
            con.query(query, (err, res) => {
                if(err){
                    reject(res)
                    throw err;
                }
                resolve(res);
            });
        })
    }
}