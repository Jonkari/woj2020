// Asenna ensin express npm install express --save

var express = require('express');
var fs = require("fs");
var app=express();

var bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const http = require('http');
const url = require('url');
var footballController = require('./footballController')

const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;

app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
  layoutsDir : __dirname + '/views/layout/',
  extname : 'hbs'
}));
var valitsevalikko = [
  "Toiminto 1",
  "Toiminto 2",
  "Toiminto 3",
  "Toiminto 4",
  "Toiminto 5"
]
var seuraavattapahtumat = [
"28.10.2018 Suomi-Unkari miesten maaottelu",
"01.11.2018 Futsal turnaus Kuopiossa",
"12.11.2018 Kauden päättäjäiset Keskuskentällä",
"28.11.2018 Pikkujoulut"

]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('public'));

app.get('/sarjataulukko', async function(request, response) {
  var sarjataulukko = null
  try {
    sarjataulukko = await footballController.fetchSarjataulukko();
  } catch(error) {
    console.log(error)
  }
  response.render('sarjataulukko', {
    layout : 'index',
    valitsevalikko : valitsevalikko,
    seuraavattapahtumat : seuraavattapahtumat,
    sarjataulukko : sarjataulukko
  })

})
app.get('/joukkueet', async function(request, response) {
  var pelaajat = null
  var joukkueet = null
  try {
    pelaajat = await footballController.fetchPelaajat();
    joukkueet = await footballController.fetchJoukkueet();
  } catch(error) {
    console.log(error)
  }
  var pelaajatstr = '<ul>';
  var joukkueetstr = '<ol>';
  if(pelaajat) {
    for(var pelaaja of pelaajat) {
      pelaajatstr += `<li>${pelaaja.Etunimi} ${pelaaja.Sukunimi} - ${pelaaja.Pelinumero}</li>`
    }
  }
  if(joukkueet) {
    for(var joukkue of joukkueet) {
      joukkueetstr += `<li>${joukkue.Nimi}, ${joukkue.Kaupunki} ${joukkue.Perustamisvuosi}</li>`
    }
  }
  pelaajatstr += '</ul>'
  joukkueetstr += '</ol>'
  response.render('joukkueet', {
    layout : 'index',
    valitsevalikko : valitsevalikko,
    seuraavattapahtumat : seuraavattapahtumat,
    pelaajat : pelaajatstr,
    joukkueet : joukkueetstr
  })
})
app.get('/', function(request, response){
    response.render('main', 
    {
      layout : 'index', 
      valitsevalikko : valitsevalikko,
      seuraavattapahtumat : seuraavattapahtumat

    })
});


app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});