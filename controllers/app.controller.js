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
var playersData = [];
var dicedNum = 0;
var latestRoller = '';

exports.joinGame = async (req, res) => {
    try {
        if (onlines.indexOf(req.user.username) === -1) {
            onlines.push(req.user.username);
            playersData.push({ username: req.user.username, piecePos: { x: 0, y: 0 } })
        }
        await res.status(200).json({ gameState: { playersData: playersData } });
    } catch (error) {
        console.log(error);
    }
};

exports.quitGame = (req, res) => {
    try {
        var userIndex = onlines.indexOf(req.user.username);
        if (userIndex !== -1) {
            onlines.splice(userIndex, 1);
            playersData.splice(userIndex, 1);
            res.status(200).send(`${req.user.username} has left the game.`);
        }
        else {
            res.status(200).send(`${req.user.username} was not in the game in the first place.`);
        }
        if (onlines.length < 1) {
            onlines = [];
            playersData = [];
            dicedNum = 0;
            latestRoller = '';
        }
    } catch (error) {
        console.log(error);
    }
};

exports.getGameState = (req, res) => {

    const data = {
        gameState: {
            playersData: playersData,
            rolledNum: dicedNum,
            latestRoller: latestRoller
        }
    }

    try {
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
};

exports.updateGameState = (req, res) => {

    const index = req.body.index;
    const username = req.body.username;
    const piecePos = req.body.piecePos;

    if (playersData[index].username === username) {
        playersData[index].piecePos = piecePos;
    }

    try {
        res.status(200).send("Sucess. Game State updated");
    } catch (error) {
        console.log(error);
    }
};

exports.rollDice = (req, res) => {

    latestRoller = req.user.username
    const max = 6;
    const min = 1;
    dicedNum = Math.floor(Math.random() * (max - min + 1)) + min;

    try {
        res.status(200).send(`${latestRoller} has rolled the dice.`);
    } catch (error) {
        console.log(error);
    }
};