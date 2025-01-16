const express = require("express");
const { UserModel, TodoModel } = require("./db");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const JWT_SECRET = "birat04";



const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
        email: email,
        password: hashedPassword,
        name: name
    });
    res.json({
        message: "You are signed up"
    });

});

app.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email
    });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
        message: "You are signed in",
        token: token
    });
});

function auth(req, res, next) {
    const token = req.headers.authorization;

    const response = jwt.verify(token, JWT_SECRET);

    if (response) {
        req.userId = response.id;
        next();
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
}


app.post("/todo", auth, async function (req, res) {
    const userId = req.user.id;
    const title = req.body.title;
    const done = req.body.done;
    await TodoModel.create({
        userId: userId,
        title: title,
        done: done
    });
    res.json({
        message: "Todo created"
    });
});

app.get("/todos", auth, async function (req, res) {
    const userId = req.user.id;
    const todos = await TodoModel.find({ userId });
    res.json(todos);
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});


