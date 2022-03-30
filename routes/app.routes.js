module.exports = app => {
    const controller = require("../controllers/app.controller");
    const auth = require("../middleware/auth");
    var router = require("express").Router();

    router.post("/register", controller.register);

    router.post("/login", controller.login);

    router.post("/welcome", auth, controller.welcome);

    router.put("/game/join", auth, controller.joinGame);

    router.put("/game/quit", auth, controller.quitGame);

    router.get("/game/onlines", controller.getGameState);

    app.use('/',router);
}