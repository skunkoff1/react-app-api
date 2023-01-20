const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const login = (req, res) => {

    const username = req.body.username;
    const pwd = req.body.pwd;

    User.findOne({ username : username})
        .then((user) => {
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
            return res.status(401).json({'message' : "utilisateur et/ou mot de passe incorrect"});
        })
}

const register = (req, res) => {

    const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    if (!USER_REGEX.test(req.body.username)) {
        return res.status(400).json({ 'error': 'format du nom d\'utilisateur incorrect' });
    }
    if (!PWD_REGEX.test(req.body.pwd)) {
        return res.status(400).json({ 'error': 'format du mot de passe incorrect' });
    }
    
    User.findOne({ username : req.body.username})
        .then((user) => {
           if(user) {
                return res.status(401).json({'message' : "nom d'utilisateur déjà utilisé"});
           }
           else {
                const newUserRecord = new User({
                    username: req.body.username,
                    password: req.body.pwd,
                });

                newUserRecord.save((err, result) => {
                    if(!err) {
                        return res.status(201).send({'message' : "enregistrement réussi"});
                    }
                    else {
                        return res.status(400).json({"error" : err});
                    }
                })
           }
        })
        .catch((err) => {
            return res.status(400).json({'erreur' : err});
        })
}

module.exports = { login, register};