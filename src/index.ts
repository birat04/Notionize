import express from "express";
import { Client } from "pg";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

const pgClient = new Client({
  connectionString:
    "postgresql://neondb_owner:npg_UA41EGeORmPT@ep-blue-silence-a1bhsl39-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});


async function setupDatabase() {
  await pgClient.connect();
  await pgClient.query(`
    CREATE SCHEMA IF NOT EXISTS todo;

    CREATE TABLE IF NOT EXISTS todo.users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      password TEXT NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL
    );
  `);
  console.log("✅ Table 'todo.users' is ready.");
}

app.post("/signup", async (req: express.Request, res: express.Response) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `
      INSERT INTO todo.users (username, password, email)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const result = await pgClient.query(insertQuery, [username, hashedPassword, email]);

    res.json({
      message: "User created successfully",
      user: {
        id: result.rows[0].id,
        username,
        email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});



app.get("/users", async (req: express.Request, res: express.Response) => {
  try {
    const result = await pgClient.query(`SELECT id, username, email FROM todo.users`);
    res.json({ users: result.rows });
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

setupDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database", err);
  });
