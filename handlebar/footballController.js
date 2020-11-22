'use strict'

const { response } = require('express');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'rooter',
  database: 'jalkapallo'
});
module.exports =
{
    fetchSarjataulukko : function() {
        return new Promise(function(resolve, reject) {
            connection.query(`SELECT sj.Ottelumaara, sj.Voittoja, sj.Tappioita, sj.Tasapeleja, sj.Tehdyt_maalit, sj.Paastetyt_maalit, sj.Pisteet, j.Nimi FROM sarjataulukko sj 
            JOIN joukkue j ON sj.Joukkue_id=j.Id`, function(error, results, query) {
                if(!error) {
                    resolve(results);
                } else {
                    reject("Virhe haettaessa dataa")
                }
            });
        })

    },
    fetchPelaajat() {
        return new Promise(function(resolve, reject) {
            connection.query(`SELECT * FROM pelaaja`, function(error, results, query) {
                if(!error) {
                    resolve(results)
                } else {
                    reject("Virhe haettaessa dataa")
                }
            })
        })
    },
    fetchJoukkueet() {
        return new Promise(function(resolve, reject) {
            connection.query(`SELECT * FROM joukkue`, function(error, results, query) {
                if(!error) {
                    resolve(results)
                } else {
                    reject("Virhe haettaessa dataa")
                }
            })
        })
    }
}