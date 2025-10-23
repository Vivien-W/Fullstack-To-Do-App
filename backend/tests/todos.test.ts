import request from "supertest";
import app from "../src/index.js"; // Dein Express-App Export
import pool from "../src/db.js";
import bcrypt from "bcrypt";

let todoId: number; // Typisiert als number

beforeAll(async () => {
  // Test-User anlegen
  const hashedPassword = await bcrypt.hash("test1234", 10);
  await pool.query(
    `INSERT INTO users (user_id, username, password)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO NOTHING`,
    [1, "testuser", hashedPassword]
  );
});

afterAll(async () => {
  // Test-User und Todos löschen
  await pool.query("DELETE FROM todo");
  await pool.query("DELETE FROM users");
  await pool.end();
});

describe("Todos API (Test DB)", () => {
  test("should add a new todo (POST /todos)", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ description: "Test todo" });

    expect(res.statusCode).toBe(201);

    // TypeScript-Typisierung für res.body
    const body: { todo_id: number; description: string; completed: boolean } =
      res.body;
    expect(body.description).toBe("Test todo");
    expect(body.completed).toBe(false);

    todoId = body.todo_id;
  });

  test("should get all todos (GET /todos)", async () => {
    const res = await request(app).get("/todos");

    expect(res.statusCode).toBe(200);
    const todos: {
      todo_id: number;
      description: string;
      completed: boolean;
    }[] = res.body;

    expect(todos.length).toBe(1);
    expect(todos[0].description).toBe("Test todo");
  });

  test("should update a todo (PUT /todos/:id)", async () => {
    const res = await request(app)
      .put(`/todos/${todoId}`)
      .send({ description: "Updated todo", completed: true });

    expect(res.statusCode).toBe(200);
    const body: { todo_id: number; description: string; completed: boolean } =
      res.body;

    expect(body.description).toBe("Updated todo");
    expect(body.completed).toBe(true);
  });

  test("should delete a todo (DELETE /todos/:id)", async () => {
    const res = await request(app).delete(`/todos/${todoId}`);

    expect(res.statusCode).toBe(200);
    const body: { message: string } = res.body;
    expect(body.message).toBe("Todo deleted");
  });

  test("should return an empty list after deletion (GET /todos)", async () => {
    const res = await request(app).get("/todos");

    expect(res.statusCode).toBe(200);
    const todos: {
      todo_id: number;
      description: string;
      completed: boolean;
    }[] = res.body;

    expect(todos.length).toBe(0);
  });
});
