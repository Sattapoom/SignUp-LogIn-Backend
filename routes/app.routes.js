module.exports = app => {
    const controller = require("../controllers/app.controller");
    const auth = require("../middleware/auth");
    var router = require("express").Router();

    router.post("/register", controller.register);

    router.post("/login", controller.login);

    router.get("/welcome", auth, controller.welcome);

    app.use('/',router);
}