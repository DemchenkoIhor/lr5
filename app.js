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
      massa: massa,
      gdk: data[0].gdk
    });

  });

});

app.post("/Summa", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  let P, A, Kt, Kz;
  P = 6700;
  A = 1 / req.body.gdk;
  Kt = req.body.K2;
  Kz = (req.body.Rv2 == 0) ? 10 : req.body.Rv2 / req.body.gdk;
  const summa = req.body.massa * 1.1 * P * A * Kt * Kz;
  res.render("Summa.hbs", {
    summa: summa

  });
});


const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});