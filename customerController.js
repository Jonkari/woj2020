'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save


var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password: 'rooter',
  database: 'asiakas'
});

module.exports =
{
  fetchTypes: function (req, res) { //Tällä saadaan Asiakastyypit listaan
    connection.query('SELECT AVAIN, SELITE FROM Asiakastyyppi', function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
        res.send({ "status": 500, "error": error, "response": null });
      }
      else {
        res.json(results);
      }
    });

  },

  fetchAll: function (req, res) { //Node.js tehtävä 1, kaikkien asiakkaiden haku

    connection.query('SELECT * FROM asiakas', function (error, results) {
      if (error) {
        console.log("Virhe: " + error);

        res.send({ "status": 500, "error": error, "response": null });
      }
      else {
        res.json(results);
      }
    })
  },

  //Node.js tehtävä 2. Asiakkaiden haku
  fetchWhere: function (req, res) {
    var nimi = req.query.NIMI;
    var osoite = req.query.OSOITE;
    var astyAvain = req.query.ASTY_AVAIN;
    var sql;
    if (astyAvain == 1 || astyAvain == 2) {
      sql = "SELECT * FROM asiakas WHERE ASTY_AVAIN=" + astyAvain + " AND NIMI LIKE '" + nimi + "%'";
      sql = sql + " AND OSOITE LIKE '" + osoite + "%'";
    }
    else {
      sql = "SELECT * FROM asiakas WHERE NIMI LIKE '" + nimi + "%'";
      sql = sql + " AND OSOITE LIKE '" + osoite + "%'";
    }

    connection.query(sql, function (error, results) {
      if (error) {
        console.log("Virhe: " + error);
        res.send({ "status": 500, "error": error, "response": null });
      }
      else {
        res.json(results);

      }
    })
  },
}