import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoApp from "../TodoApp";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("TodoApp Component", () => {
  const mockSetToken = jest.fn();
  const mockSetLoggedOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test 1: Überschrift wird gerendert :)
  test("renders header text", () => {
    render(
      <TodoApp
        token="fake-token"
        setToken={jest.fn()}
        setLoggedOut={jest.fn()}
      />
    );
    expect(screen.getByText(/Deine To-Do-Liste/i)).toBeInTheDocument();
  });

  // ✅ Test 2: Neues To-Do hinzufügen funktioniert

  test("adds a new todo", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    mockedAxios.post.mockResolvedValueOnce({
      data: { todo_id: 1, description: "Socken sortieren", completed: false },
    });

    render(
      <TodoApp
        token="fake-token"
        setToken={mockSetToken}
        setLoggedOut={mockSetLoggedOut}
      />
    );

    const input = screen.getByPlaceholderText(/what needs to be done\?/i);
    const addButton = screen.getByRole("button", { name: /add task/i });

    fireEvent.change(input, { target: { value: "Socken sortieren" } });
    fireEvent.click(addButton);

    const addedTodo = await screen.findByText(/socken sortieren/i);
    expect(addedTodo).toBeInTheDocument();
  });

  // ✅ Test 3: Logout funktioniert korrekt
  test("logs out correctly when logout button is clicked", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(
      <TodoApp
        token="fake-token"
        setToken={mockSetToken}
        setLoggedOut={mockSetLoggedOut}
      />
    );

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockSetToken).toHaveBeenCalledWith(null);
    expect(mockSetLoggedOut).toHaveBeenCalledWith(true);
  });

  // ✅ Test 4: Fehler beim Hinzufügen eines Todos zeigt Fehlermeldung an
  test("shows error message when adding todo fails", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    mockedAxios.post.mockRejectedValueOnce(new Error("Network error"));

    render(
      <TodoApp
        token="fake-token"
        setToken={mockSetToken}
        setLoggedOut={mockSetLoggedOut}
      />
    );

    const input = screen.getByPlaceholderText(/what needs to be done\?/i);
    const addButton = screen.getByRole("button", { name: /add task/i });

    fireEvent.change(input, { target: { value: "Fehler Todo" } });
    fireEvent.click(addButton);

    const errorMsg = await screen.findByText(
      /failed to add todo\. please try again\./i
    );
    expect(errorMsg).toBeInTheDocument();
  });

  // ✅ Test 5: Bereits vorhandene Todos werden korrekt angezeigt
  test("renders existing todos on mount", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { todo_id: 1, description: "Einkaufen", completed: false },
        { todo_id: 2, description: "Auto waschen", completed: true },
      ],
    });

    render(
      <TodoApp
        token="fake-token"
        setToken={mockSetToken}
        setLoggedOut={mockSetLoggedOut}
      />
    );

    const todo1 = await screen.findByText(/einkaufen/i);
    const todo2 = await screen.findByText(/auto waschen/i);

    expect(todo1).toBeInTheDocument();
    expect(todo2).toBeInTheDocument();
  });
});
