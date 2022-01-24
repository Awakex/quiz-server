const Router = require("express");
const router = new Router();
const controller = require("./../controllers/auth-controller");
const { check } = require("express-validator");
const roleMiddleware = require("./../middlewares/role-middleware");

router.post(
    `/registration`,
    [
        check("username", "Имя пользователя не может быть пустым").notEmpty(),
        check("password", "Пароль должен быть больше 4 и меньше 10 символов").isLength({
            min: 4,
            max: 10,
        }),
    ],
    controller.registration
);
router.post(`/login`, controller.login);
router.get(`/users`, roleMiddleware(["USER", "ADMIN"]), controller.getUsers);

module.exports = router;
