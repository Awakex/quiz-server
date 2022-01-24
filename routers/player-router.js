const Router = require("express");
const router = new Router();
const roleMiddleware = require("./../middlewares/role-middleware");
const countController = require("../controllers/count-game-controller");

router.post(
    `/generate-example`,
    roleMiddleware(["USER", "ADMIN"]),
    countController.getExample.bind(countController)
);

router.post(
    `/check-example`,
    roleMiddleware(["USER", "ADMIN"]),
    countController.checkExample.bind(countController)
);

module.exports = router;
