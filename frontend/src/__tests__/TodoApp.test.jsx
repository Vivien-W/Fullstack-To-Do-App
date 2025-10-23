import { render, screen, fireEvent } from "@testing-library/react";
import TodoApp from "../TodoApp";

test("renders header text", () => {
  render(<TodoApp token="fake-token" />);
  expect(screen.getByText(/FULLSTACK TODO APP/i)).toBeInTheDocument();
});
