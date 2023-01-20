const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const login = (req, res) => {

    const username = req.body.username;
    const pwd = req.body.pwd;

    User.findOne({ username : username})
        .then((user) => {
            if(!user) {
                return res.status(404).json({ 'message': 'utilisateur inconnu' });
            }
            else {
                bcrypt.compare(req.body.pwd, user.password, function(err, boolCrypt) {
                    if (boolCrypt) {
                        let token = jwt.sign({ "sub": username }, process.env.SECRET, { expiresIn: '120m' });
                        res.status(200).send({ "user": user, "token": token, "message" : "connection réussie" });
                    } else if (!boolCrypt) {
                        return res.status(400).json({ 'message': 'Mot de passe incorrect' });
                    } else {
                        return res.status(500).json({ 'error': 'Une erreur est survenue' + err });
                    }
                })
            }
            
        })
        .catch((err) => {
            return res.status(400).json({'message' : "utilisateur et/ou mot de passe incorrect"});
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
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.pwd, salt, function(err, hashedPass) {
                        const newUserRecord = new User({
                            username: req.body.username,
                            password: hashedPass,
                        });

                        newUserRecord.save((err, result) => {
                            if(!err) {
                                return res.status(201).send({'message' : "enregistrement réussi"});
                            }
                            else {
                                return res.status(400).json({"message" : err});
                            }
                        })
                    })
                })
           }
        })
        .catch((err) => {
            return res.status(400).json({'erreur' : err});
        })
}

module.exports = { login, register};