import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const app = express();
const client = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";


interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}


app.use(cors());
app.use(express.json());


const userSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

const todoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});


const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
    return;
  }
};


app.post("/auth/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = userSchema.parse(req.body);
    
    
    const existingUser = await client.users.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const user = await client.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
      }
    });

  
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

   
    const user = await client.users.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }


    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get("/users/me", authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await client.users.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        username: true,
        email: true,
        age: true,
        created_at: true,
        addresses: true,
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get("/todos", authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const todos = await client.todo.findMany({
      where: { user_id: req.user!.userId },
      orderBy: { created_at: 'desc' }
    });
    res.json({ todos });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/todos", authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description } = todoSchema.parse(req.body);
    
    const todo = await client.todo.create({
      data: {
        title,
        description,
        user_id: req.user!.userId,
      }
    });

    res.status(201).json({ todo });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put("/todos/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, completed } = todoSchema.parse(req.body);

    const todo = await client.todo.findFirst({
      where: { id: parseInt(id), user_id: req.user!.userId }
    });

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    const updatedTodo = await client.todo.update({
      where: { id: parseInt(id) },
      data: { title, description, completed }
    });

    res.json({ todo: updatedTodo });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete("/todos/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const todo = await client.todo.findFirst({
      where: { id: parseInt(id), user_id: req.user!.userId }
    });

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    await client.todo.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get("/addresses", authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const addresses = await client.addresses.findMany({
      where: { user_id: req.user!.userId }
    });
    res.json({ addresses });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/addresses", authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { city, country, street, pincode } = req.body;
    
    const address = await client.addresses.create({
      data: {
        city,
        country,
        street,
        pincode,
        user_id: req.user!.userId,
      }
    });

    res.status(201).json({ address });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get("/health", (req: Request, res: Response): void => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
