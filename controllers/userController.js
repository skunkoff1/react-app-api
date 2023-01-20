const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const login = (req, res) => {

    const username = req.body.username;
    const pwd = req.body.pwd;

    User.findOne({ username : username})
        .then((user) => {
            console.log(user);
            if(pwd != user.password) {
                return res.status(401).json({'message' : "utilisateur et/ou mot de passe incorrect"});
            }
            else if(pwd == user.password) {
                const token = jwt.sign({ login: username}, process.env.SECRET);
                return res.status(200).json({'message' : "connection réussie", 'token' : token});
            }
            else {
                return res.status(400).json({'message' : "mauvaise requete"});
            }
            
        })
        .catch((err) => {
            res.status(500).json({ 'error': err });
        })
}

const register = (req, res) => {
    
    const newUserRecord = new User({
        username: req.body.username,
        password: req.body.pwd,
    })
    
    newUserRecord.save((err, result) => {
        if(!err) {
            return res.status(201).send(result);
        }
        else {
            return res.status(400).json({"error" : err});
        }
    })
}

module.exports = { login, register};