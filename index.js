require('dotenv').config();
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

const port = 8080;

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
});

let createRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password()
  ];
};

// home route
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("some error is found");
  }
});

// show route
app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showuser.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("some error is found");
  }
});

// edit route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("some error is found");
  }
});

// update route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Worng password");
      } else {
        let q2 = ` UPDATE user SET username = '${newUsername}'WHERE id = '${id}' `

        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("some error is found");
  }
});

// create new user route
app.get("/user/new", (req, res) => {
  res.render("newpost");
});

app.post("/user", (req, res) => {
  let q = "INSERT INTO user SET ?";

  try {
    connection.query(q, req.body, (err, result) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("some error is found");
  }

});

// delete authantication
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("some error is found");
  }
});


// delete route
app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let {password} = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (user.password != password) {
        res.send("Worng password");
      } else {
        let q2 = `DELETE FROM user WHERE id= '${id}'`
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("some error is found");
  }
});

app.listen(port, () => {
  console.log("port is listening successfully");
});


