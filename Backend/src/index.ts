import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function createUser() {
  try {
    await client.users.create({
      data: {
        username: "birat05",
        email: "birat05@gmail.com",
        password: "password123", 
        age: 22
      },
    });

    console.log("User created!");
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await client.$disconnect();
  }
}

createUser();
