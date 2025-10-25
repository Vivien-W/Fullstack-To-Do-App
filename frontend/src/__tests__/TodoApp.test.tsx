import { render, screen, fireEvent } from "@testing-library/react";
import TodoApp from "../TodoApp.js";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("TodoApp Component", () => {
  const mockSetToken = jest.fn();
  const mockSetLoggedOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders header text", () => {
    render(
      <TodoApp
        token="fake-token"
        setToken={jest.fn()}
        setLoggedOut={jest.fn()}
      />
    );

    expect(screen.getByText(/FULLSTACK TODO APP/i)).toBeInTheDocument();
  });

  test("adds a new todo", async () => {
    render(
      <TodoApp
        token="fake-token"
        setToken={mockSetToken}
        setLoggedOut={mockSetLoggedOut}
      />
    );

    // Mock das POST request
    mockedAxios.post.mockResolvedValueOnce({
      data: { todo_id: 1, description: "Socken sortieren", completed: false },
    });

    const input = screen.getByPlaceholderText(/what needs to be done\?/i);
    const addButton = screen.getByRole("button", { name: /add task/i });

    fireEvent.change(input, { target: { value: "Socken sortieren" } });
    fireEvent.click(addButton);

    // Das Todo sollte jetzt erscheinen
    const addedTodo = await screen.findByText(/socken sortieren/i);
    expect(addedTodo).toBeInTheDocument();
  });
});
