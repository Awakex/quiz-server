const User = require("./../models/user");
const Role = require("./../models/role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./../config");

const generateAccessToken = (id, roles, username) => {
    const payload = {
        id,
        roles,
        username,
    };

    return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "2", errors });
            }
            const { username, password } = req.body;
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).json({ message: "3" });
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: "USER" });
            const user = new User({
                username,
                password: hashPassword,
                roles: [userRole.value],
            });
            await user.save();

            const newUser = await User.findOne({ username });
            const token = generateAccessToken(newUser._id, user.roles, username);

            return res.json({
                message: "Пользователь успешно зарегестрирован",
                token,
                user: newUser,
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Registration error" });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 1 });
            }

            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: `Введен неверный пароль` });
            }
            const token = generateAccessToken(user._id, user.roles, username);
            return res.json({ token });
        } catch (e) {
            res.status(400).json({ message: "Login error" });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (e) {}
    }
}

module.exports = new authController();
