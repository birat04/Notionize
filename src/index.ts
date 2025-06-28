import express from "express";
import { Client } from "pg";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

const pgClient = new Client({
  connectionString:
    "postgresql://neondb_owner:npg_6e7oTMFKPnku@ep-solitary-truth-a1iyvkas-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});


async function setupDatabase() {
  await pgClient.connect();
  await pgClient.query(`

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      password TEXT NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      city VARCHAR(100),
      country VARCHAR(100),
      street VARCHAR(200),
      pincode VARCHAR(20)
    );
  `);
  console.log("✅ Tables 'users' and 'addresses' are ready.");
}

app.post("/signup", async (req: express.Request, res: express.Response) => {
  const username  = req.body.username;
  const password  = req.body.password;
  const email  = req.body.email;

  const city = req.body.city;
  const country = req.body.country;
  const street = req.body.street;
  const pincode = req.body.pincode;

  try {
    await pgClient.query("BEGIN");
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `
    INSERT INTO users (username, password, email)
    VALUES ($1, $2, $3)
    RETURNING id;
    `;
    const result = await pgClient.query(insertQuery, [username, hashedPassword, email]);
    const addressInsertQuery = `
    INSERT INTO addresses (user_id, city, country, street, pincode)
    VALUES ($1, $2, $3, $4, $5);
    `;
    await pgClient.query(addressInsertQuery, [result.rows[0].id, city, country, street, pincode]);
    await pgClient.query("COMMIT");

    res.json({
      message: "User created successfully",
      user: {
        id: result.rows[0].id,
        username,
        email,
      },
    });
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      console.error("Signup error:", err);
      res.status(500).json({ error: "Failed to create user" });
    }
  }
});



app.get("/users", async (req: express.Request, res: express.Response) => {
  try {
    const result = await pgClient.query(`SELECT id, username, email FROM users`);
    res.json({ users: result.rows });
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("transactions", async (req: express.Request, res: express.Response) => {
  try {
    const result = await pgClient.query(`INSERT INTO transactions (user_id, amount, description) VALUES ($1, $2, $3)`, [req.body.user_id, req.body.amount, req.body.description]);
    res.json({ message: "Transaction created successfully", transaction: result.rows[0] });
  } catch (err) {
    console.error("Create transaction error:", err);
    res.status(500).json({ error: "Failed to create transaction" });
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
