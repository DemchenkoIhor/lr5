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

app.get("/task1", function (req, res) {

  bd.query("Select * from substances_lr5;", function (err, data) {
    if (err) return console.log(err);
    res.render("task1.hbs", {
      select_substances: data
    });
    //console.log(data);
  });
});

app.post("/task1_2", urlencodedParser, (req, res) => {
  console.log(req.body);
  const { N1, N2, N3, N4, N5 } = req.body;
  let suma = Number(N1) * 0.28 + Number(N2) * 6.5 + Number(N3) * 37 + Number(N4) * 47;
  let S2 = 12 * 0.15 * N4;
  suma += S2;
  suma *= 1000;
  let child = [];
  for (let i = 0; i < Number(N5); i++) {
    child.push(i + 1);
  }

  res.render("task1_2", {
    suma: suma,
    amountChild: child,
    child: child.length
  });

})

app.get("/task1_2", (req, res) => {
  res.render("task1_2");
});

app.post("/task1_3", urlencodedParser, (req, res) => {
  console.log(req.body);
  let { amount_child, years } = req.body;
  //console.log(years[0]);
  let S3 = 0;

  let suma = Number(req.body.suma)
  if (amount_child) {
    for (let i = 0; i < amount_child; i++) {
      S3 += 12 * 0.037 * (18 - Number(years[i]));
    }
  }
  console.log(S3);
  S3 *= 1000;
  suma += S3;

  res.render("task1_3", {
    summa: suma.toFixed(2),

  });

})

app.get("/task2", (req, res) => {
  res.render("task2");
});

app.post("/task2", urlencodedParser, (req, res) => {
  console.log(req.body);
  const N1 = req.body.N1;
  let obj = []

  for (let i = 0; i < Number(N1); i++) {
    obj.push(i + 1);
  }

  res.render("task2_1", { // task2_1 get
    amount_obj: obj,
    obj: obj.length
  });
})


app.post("/task2_1", urlencodedParser, (req, res) => {
  console.log(req.body);
  const { AmountProduct, amoubtObj, obj } = req.body;
  //обрахувати Ф суми

  let F = 0;
  let Fcur = 1;
  console.log(Number(amoubtObj) * 3);
  for (let i = 0; i < Number(amoubtObj) * 3; i++) {
    if (i % 3 == 2) {
      Fcur -= obj[i];
      F += Fcur;
      Fcur = 1;
    }
    else {
      Fcur *= obj[i];
    }
  }


  let product = [];
  for (let i = 0; i < Number(AmountProduct); i++) {
    product.push(i + 1);
  }

  res.render("task2_2", { // task2_2 get  обрахунок в g
    product: product,
    product_amount: product.length,
    suma: F
  });
})

app.post("/task2_2", urlencodedParser, (req, res) => {
  console.log(req.body);
  let sumaCur = Number(req.body.SumaCur);
  const { prod, AmountProduct, product_amount } = req.body;


  let Scur = 1;

  for (let i = 0; i < Number(product_amount) * 2; i++) {
    if (i % 2 == 1) {
      Scur *= prod[i];
      sumaCur += Scur;
      Scur = 1;
    }
    else {
      Scur *= prod[i];
    }
  }
  console.log(sumaCur);

  let product = [];
  for (let i = 0; i < Number(AmountProduct); i++) {
    product.push(i + 1);
  }
  res.render("task2_3", { // task2_2 get  обрахунок в g
    product: product,
    product_amount: product.length,
    suma: sumaCur
  });
})



app.post("/task2_3", urlencodedParser, (req, res) => {
  console.log(req.body);
  let sumaCur = Number(req.body.SumaCur);
  const { prod, productAmount } = req.body;

  let Scur = 1;

  for (let i = 0; i < Number(productAmount) * 5; i++) {
    if (i % 5 == 4) {
      Scur -= prod[i];
      sumaCur += Scur;
      Scur = 1;
    }
    else {
      Scur *= prod[i];
    }
  }
  console.log(sumaCur);

  res.render("task2_suma", { // task2_suma get  обрахунок в g
    suma: sumaCur
  });
})


app.get("/task3", function (req, res) {
  bd.query("SELECT * FROM ecomon.lr6_task4;", function (err, data) {
    if (err) return console.log(err);
    res.render("task3.hbs", {
      oblKof: data
    });

  });
})


app.post("/task3", urlencodedParser, (req, res) => {
  const { form_select, Nomer, P, k } = req.body;
  console.log(req.body);


  bd.query("Select * from lr6_task4 where id=?", [form_select], function (err, data) {
    if (err) return console.log(err);
    console.log(data[0]);
    let suma = 0;
    let S1 = 0;
    let S2 = 0;

    if (Nomer == 1) {
      S1 = data[0].k1 * P;
      S2 = (1 - k) * data[0].k1 * P;
      suma = S1 + S2;

    }
    else if (Nomer == 2) {
      S1 = data[0].k2 * P;
      S2 = (1 - k) * data[0].k2 * P;
      suma = S1 + S2;
    }
    else {
      S1 = data[0].k3 * P;
      S2 = (1 - k) * data[0].k3 * P;
      suma = S1 + S2;

    }

    res.render("task3_suma.hbs", {
      suma: suma.toFixed(2),
    });

  });
})


app.get("/task5", (req, res) => {
  res.render("task5");
});

app.post("/task5", urlencodedParser, (req, res) => {
  console.log(req.body);
  let sumaCur = Number(req.body.SumaCur);
  const { N, B } = req.body;

  let sum = Number(N) * Number(B);

  res.render("task5_suma", { // task5_suma get  обрахунок в g
    suma: sum
  });
})


app.get("/task6", function (req, res) {
  bd.query("SELECT * FROM ecomon.lr6_task6 order by obl;", function (err, data) {
    if (err) return console.log(err);
    res.render("task6.hbs", {
      oblKof: data
    });

  });
})


app.post("/task6", urlencodedParser, (req, res) => {
  const { form_select, TypeForest, P, k1, k2 } = req.body;
  console.log(req.body);


  bd.query("select * from ecomon.lr6_task6 where id =?", [form_select], function (err, data) {
    if (err) return console.log(err);
    console.log(data[0]);
    let suma = 0;
    let S1 = 0;
    let S2 = 0;

    if (TypeForest == 1) {
      S1 = data[0].group1 * k1 * P;
      S2 = (1 - k2) * data[0].group1 * P;
      suma = S1 + S2;

    }
    else {
      S1 = data[0].group2 * k1 * P;
      S2 = (1 - k2) * data[0].group2 * P;
      suma = S1 + S2;
    }

    res.render("task6_suma.hbs", {
      suma: suma.toFixed(2),
    });

  });
})

app.get("/task7", (req, res) => {
  res.render("task7");
});

app.post("/task7", urlencodedParser, (req, res) => {
  console.log(req.body);
  let sumaCur = Number(req.body.SumaCur);
  const { P, P1, P2, S, M, K1, K2 } = req.body;

  let sum = (Number(P) * Number(S) * Number(M)) + (Number(P1) * Number(S) * Number(M) * (Number(K1) / 100)) + (Number(P2) * Number(S) * Number(M) * (Number(K2) / 100));

  res.render("task7_suma", { // task5_suma get  обрахунок в g
    suma: sum.toFixed(2)
  });
})

app.get("/task8", (req, res) => {
  res.render("task8");
});

app.post("/task8", urlencodedParser, (req, res) => {
  console.log(req.body);
  let sumaCur = Number(req.body.SumaCur);
  const { Money, Days } = req.body;

  let sum = Number(Money) * Number(Days);

  res.render("task8_suma", { // task8_suma get  
    suma: sum
  });
})


app.get("/task9", (req, res) => {
  res.render("task9");
});

app.post("/task9", urlencodedParser, (req, res) => {
  console.log(req.body);
  const { A1, A2, Q1, Q2, k } = req.body;
  //обрахувати Ф суми

  let curSum = 0;
  curSum = Number(A1) + Number(A2) + (Number(Q1) - Number(Q2))

  let tax = [];
  for (let i = 0; i < Number(k); i++) {
    tax.push(i + 1);
  }

  res.render("task9_1", { // task2_2 get  обрахунок в g
    taxes: tax,
    tax_amount: tax.length,
    suma: curSum
  });
})

app.post("/task9_1", urlencodedParser, (req, res) => {
  console.log(req.body);
  const { tax, SumaCur } = req.body;
  //обрахувати Ф суми

  let sum = Number(SumaCur);

  for (let i = 0; i < tax.length; i++) {
    sum += Number(tax[i]);
  }

  res.render("task9_suma", { // task8_suma get  
    suma: sum
  });
})


app.get("/task11", function (req, res) {
  bd.query("SELECT * FROM ecomon.lr6_task11; SELECT * FROM ecomon.lr6_task11_2;", function (err, data) {
    if (err) return console.log(err);
    res.render("task11.hbs", {
      oblKof: data[0],
      na: data[1]
    });

  });
})

app.post("/task11", urlencodedParser, (req, res) => {
  const { yn, n, L, F, m, na } = req.body;
  console.log(req.body);
  let Suma = 0;
  let V = 0;
  V = Number(F) * Number(m) * Number(na);
  Suma = Number(yn) * Number(n) * V * Number(L);

  res.render("task11_suma", { // task8_suma get  
    suma: Suma
  });

})

app.get("/task12", function (req, res) {
  bd.query("SELECT * FROM ecomon.lr6_task11; SELECT * FROM ecomon.lr6_task11_2;", function (err, data) {
    if (err) return console.log(err);
    res.render("task12.hbs", {
      oblKof: data[0],
      na: data[1]
    });

  });
})

app.post("/task12", urlencodedParser, (req, res) => {
  const { yn, n, M, L, } = req.body;
  console.log(req.body);
  let Suma = 0;

  Suma = Number(yn) * Number(n) * Number(L) * Number(M);

  res.render("task12_suma", { // task8_suma get  
    suma: Suma.toFixed(2)
  });

})







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
  let P, A, ktNas, Kt, Kz;
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

  Kt = ktNas * req.body.K2;

  Kz = (req.body.Rv2 == 0) ? 1 : req.body.Rv2 / req.body.gdk;
  console.log(Kt);
  console.log(A);
  console.log(Kz);
  console.log(req.body.massa);
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