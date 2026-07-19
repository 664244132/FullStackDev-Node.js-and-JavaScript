import express from "express";
import db from "./db.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import dotenv from "dotenv";

const app = express();
app.use(express.json());

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body
    console.log(`user : ${username}, password : ${password}`);

    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    console.log(users);
    if (users.length === 0 || !(await compare(password, users[0].password))) {
        return res.status(404).json({ msg: "User not found" });
    }

    const payload = {
        id: users[0].id,
        username: users[0].username
    }

    const token = jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({ msg: "login สำเร็จ", token: token });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000 http://localhost:3000");
});