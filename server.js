const express = require('express');
const { json } = require('body-parser');
const app = express();

app.use(express.json());

const users = [{
    id: "1",
    name: "chirag",
    image: "",
    email: "chirag@gmail.com",
    password: "chirag",
    joined: new Date()
}, {
    id: "2",
    name: "vaishu",
    image: "",
    email: "vaishu@gmail.com",
    password: "vaishu",
    joined: new Date()
}]

app.get("/", (req, res) => {
    res.json(users)
})

app.post("/login", (req, res) =>{
    const filteredUser = users.filter((user) => {
        return (req.body.email === user.email && req.body.password === user.password)
    })
    if(filteredUser.length) {
        res.json(filteredUser[0])
    } else {
        res.status(404).json("Not a valid user");
    }
})

app.post("/register", (req, res) => {
    const {id, name, email, password, image} = req.body;
    const newUser = {
        id: id,
        name: name,
        image: image,
        email: email,
        password: password,
        joined: new Date()
    }
    if (newUser.email) {
        users.push(newUser);
        res.json(newUser);
    } else {
        res.status(404).json("Something went wrong");
    }    
})

app.get("/:id", (req, res) => {
    const filteredUser = users.filter((user) => {
        return (req.params.id === user.id)
    })
    if(filteredUser.length) {
        res.json(filteredUser[0])
    } else {
        res.status(404).json("User not found");
    }
})

app.put("/:id", (req, res) => {
    const matchedUser = users.filter((user) => {
        return (req.params.id === user.id)
    })
    if(matchedUser.length) {
        matchedUser[0].image = req.body.image;       
        res.json(matchedUser[0]);
    } else {
        res.status(404).json("User not found");
    }
})

app.listen(3001, () => {
    console.log("server has started");
})