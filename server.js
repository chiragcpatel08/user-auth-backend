require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const knex = require('knex')
const bcrypt = require("bcrypt-nodejs");

app.use(express.json());
app.use(cors());

const database = knex({
    client: 'pg',
    connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
    }
});

app.get("/", (req, res) => {
    database.select("*").from("users")
    .then(users => res.json(users))
})

app.post("/login", (req, res) => {
    const {email, password} = req.body;
    database.select('email', 'hash').from('login').where({email: email})
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid){
            database.select('*').from('users').where({email: email})
            .then(user=>{
                res.json(user[0]);
            })
            .catch(err=> {
                res.status(400).json("Spurious User Credentials");
            })            
        } else {
            res.status(400).json("Invalid User Credentials");
        }
    })
    .catch(err=> {
        res.status(400).json("Wrong User Credentials");
    })
});

app.post("/register", (req, res) => {
    const {name, email, image, password} = req.body;
    const hash = bcrypt.hashSync(password);
    database.transaction(trx => {    
        trx.insert({
            hash: hash,
            email: email
        })
          .into('login')
          .returning('email')
          .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                name: name,
                email: loginEmail[0],
                image: image,
                joined: new Date()
            })
            .then(newUser => {
                res.json(newUser[0]);
            })            
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch(err => {
        res.status(400).json("Unable to register user");
    })
});

app.listen(3001, () => {
    console.log("server has started");
})