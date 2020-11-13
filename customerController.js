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

  fetchAll: function (req, res) { //Node.js tehtävä 2, kaikkien asiakkaiden haku

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

  //Node.js tehtävä 3. Asiakkaiden haku
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
  create: function (req, res){ //Node.js tehtävä 4, asiakkaan lisääminen
    if(!req.body.hasOwnProperty('nimi') || !req.body.hasOwnProperty('osoite') || !req.body.hasOwnProperty('postinro') || 
    !req.body.hasOwnProperty('postitmp') || !req.body.hasOwnProperty('asty_avain')||
    req.body.nimi == ""|| req.body.osoite==""|| req.body.postinro==""|| req.body.postitmp==""|| req.body.asty_avain=="") 
    {
      res.status(400);
      res.json({"status" : "Error", "message" : "Ei saa jättää tyhjiä kenttiä"})
      return;
    }

    connection.query("INSERT INTO asiakas (nimi, osoite, postinro, postitmp, luontipvm, asty_avain) VALUES (?, ?, ?, ?, CURDATE() , ?)",[req.body.nimi, req.body.osoite, req.body.postinro, req.body.postitmp, req.body.asty_avain], function(error, results, fields) {
      if(error) {
        console.log(error);
        res.status(500);
        res.json({"status" : "Error"})
      } else {
        res.status(200);
        res.json({"status" : "Success"});
      }
  }
    )},
    
  update: function (req, res){

  },

  //teht 6 asiakkaan poistaminen
  delete: function (req, res) {
    if(!req.params.hasOwnProperty('id')){
      res.status(400);
      res.json({"status" : "Error"});
    }
    connection.query("DELETE FROM asiakas WHERE avain=?",[req.params.id], function (error, results, fields){
      if(error){
        console.log(error);
        res.status(500);
        res.json({"status" : "Error"})
      }
      else {
        res.status(200);
        res.json({"status" : "Success"});
      }
    })
  },
}