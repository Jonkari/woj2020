'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost', // tietokantapalvelimen osoite
    port : 3307, //oletuksena käyttää porttia 3306
    user : 'root', //kehitystarkoituksessa voidaan käyttää root-käyttäjää. Tuotannossa ei saa käyttää root-käyttäjää
    password : 'Yp2994rdSA', //voi olla tyhjäkin, käyttäkää mikä teillä on
    database : 'asiakas'
});

module.exports = 
{
    fetchTypes: function (req, res) {  
      connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function(error, results, fields){
        if ( error ){
            console.log("Virhe haettaessa dataa Asiakas-taulusta: " + error);
            res.status(500); //Tämä lähtee selaimelle
            res.json({"status" : "ei toiminut"}); // Ja tämä lähtee selaimelle
        }
        else
        {
            console.log("Data = " + JSON.stringify(results));
            res.json(results); //onnistunut data lähetetään selaimelle (tai muulle vastaanottajalle)
        }
    });

    },

    fetchAll: function(req, res){
        console.log("Body = " +JSON.stringify(req.body));
        console.log("Params = " +JSON.stringify(req.query));
        console.log(req.query.nimi); // undefined, niin silloin ei ole nimi avainta
      res.send("Kutsuttiin fetchAll");
    },

    create: function(req, res){
        //connection.query...
        console.log("Data = " + JSON.stringify(req.body));
        console.log(req.body.nimi);
      res.send("Kutsuttiin create");
    },

    update: function(req, res){

    },

    delete : function (req, res) {
        console.log("Body = " + JSON.stringify(req.body));
        console.log("Params = " + JSON.stringify(req.params));
        res.send("Kutsuttiin delete");
    }
}
