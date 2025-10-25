import { render, screen, fireEvent } from "@testing-library/react";
import TodoApp from "../TodoApp.js";

test("renders header text", () => {
  render(
    <TodoApp token="fake-token" setToken={jest.fn()} setLoggedOut={jest.fn()} />
  );

  expect(screen.getByText(/FULLSTACK TODO APP/i)).toBeInTheDocument();
});
