const jwt = require('jsonwebtoken');
const User = require('../model/user');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!(username && password)) {
            res.status(400).send("All input is required");
        }

        const oldUser = await User.findOne({ username });

        if (oldUser) {
            return res.status(409).send("User already exist. Please login.")
        }

        encryptedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            username: username,
            password: encryptedPassword
        })

        const token = jwt.sign(
            { user_id: user._id, username },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h"
            }
        )

        user.token = token;

        res.status(201).json(user);

    } catch (error) {
        console.log(error);
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!(username && password)) {
            res.status(400).send("All input is required");
        }

        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {

            const token = jwt.sign(
                { user_id: user._id, username },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            )
            user.token = token;
            res.status(200).json(user);
        };

        res.status(400).send("Invalid Credentials");

    } catch (error) {
        console.log(error);
    }
};

exports.welcome = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(error);
    }
};

var onlines = [];

exports.joinGame = async (req, res) => {
    try {
        if (onlines.indexOf(req.user.username) === -1) {
            onlines.push(req.user.username);
        }
        await res.status(200).json({ players: onlines });
    } catch (error) {
        console.log(error);
    }
};

exports.quitGame = (req, res) => {
    try {
        var userIndex = onlines.indexOf(req.user.username);
        if (userIndex !== -1) {
            onlines.splice(userIndex, 1);
            res.status(200).send(`${req.user.username} has left the game.`);
        }
        else{
            res.status(200).send(`${req.user.username} was not in the game in the first place.`);
        }
    } catch (error) {
        console.log(error);
    }
};

exports.getGameState = (req, res) => {

    const data = {
        players: onlines
    }

    try {
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
};