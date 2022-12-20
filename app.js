const mysql = require('mysql');
const express = require("express");
const app = express();

const urlencodedParser = express.urlencoded({ extended: false });
// встановлює Handlebars як двигун представлень в Express
app.set("view engine", "hbs");


// зміна, в якій зберігаються дані для підключення до БД 
var bd = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "ecomon",
  password: "sql1234",
  multipleStatements: true
});

// підключення до БД
bd.connect(function (err) {
  if (err) {
    return console.error("Error-connect: " + err.message);
  }
  else {
    console.log("Connection to MySQL OK!");
  }
});

app.get("/", function (req, res) {

  bd.query("Select * from substances_lr5;", function (err, data) {
    if (err) return console.log(err);
    res.render("index.hbs", {
      select_substances: data
    });
    //console.log(data);
  });
});

app.post("/Tax", urlencodedParser, function (req, res) {


  bd.query("Select * from substances_lr5 where id_subst=?", [req.body.form_select], function (err, data) {
    if (err) return console.log(err);
    //console.log(data[0].gdv);
    const massa = 0.0000036 * (req.body.Rv - data[0].gdv) * req.body.Qv * req.body.T

    res.render("tax.hbs", {
      select_substances: data,
      massa: massa.toFixed(3),
      gdk: data[0].gdk
    });

  });

});

app.post("/Summa", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  console.log(req.body);
  let P, A, ktNas, Kt,Kz;
  P = 6700;
  A = 1 / req.body.gdk;

  if (req.body.K1 < 100000)
    ktNas = 1;
  else if (req.body.K1 >= 100000 && req.body.K1 < 250000)
    ktNas = 1.2;
  else if (req.body.K1 >= 250000 && req.body.K1 < 500000)
    ktNas = 1.35;
  else if (req.body.K1 >= 500000 && req.body.K1 < 1000000)
    ktNas = 1.55;
  else
    ktNas = 1.8;

    Kt =ktNas*req.body.K2;
  
 Kz = (req.body.Rv2 == 0) ? 1 : req.body.Rv2 / req.body.gdk;
  console.log(Kt);
  console.log(A);
  console.log(Kz);
  console.log(req.body.massa );
  console.log(P);

  const summa = req.body.massa * 1.1 * P * A * Kt * Kz;
  res.render("Summa.hbs", {
    summa: summa

  });
});



const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});