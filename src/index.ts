import express from "express";
import {Client} from "pg";

const app = express();
app.use(express.json());

const pgClient = new Client("postgresql://neondb_owner:npg_UA41EGeORmPT@ep-blue-silence-a1bhsl39-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require")
pgClient.connect()


app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const response = await pgClient.query(`
        INSERT INTO todo.users (username, password, email) VALUES (${username}
        , ${password}, ${email});`);

        res.json({
            message: "User created successfully",
            user: {
                username: username,
                email: email
            }
        })
    
})
app.listen(3000)

