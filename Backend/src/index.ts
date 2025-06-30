import express from "express";
import { PrismaClient } from "@prisma/client";
import { parse } from "path";
const app = express();

const client = new PrismaClient();

app.get("/users", async (req, res) => {
  const users = await client.users.findMany();
  res.json({
    users
  });
});
app.get("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const user = await client.users.findFirst({
    where: {
      id: parseInt(id)
    },
    select: {
      todos: true,
      username: true,
      password: true,
    }
  });
  res.json({
    user
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
async function createUser() {
  const user = await client.users.findFirst({
    where: {
      id: 1

    },
    include: {
      addresses: true
    }
  })
  console.log(user)
}

createUser();
