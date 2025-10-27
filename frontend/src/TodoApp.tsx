import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose, IoLogOutOutline } from "react-icons/io5";

// Props-Typ
interface TodoAppProps {
  token: string;
  setToken: (token: string | null) => void;
  setLoggedOut: (val: boolean) => void;
}

// Todo-Typ
interface Todo {
  todo_id: number;
  description: string;
  completed: boolean;
}

export default function TodoApp({
  token,
  setToken,
  setLoggedOut,
}: TodoAppProps) {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = "http://localhost:5000";
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setLoggedOut(true);
  };

  const getTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<Todo[]>(`${API_BASE}/todos`, config);
      setTodos(res.data);
    } catch (err: any) {
      console.error(err.message);
      setError("Failed to fetch todos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      setError(null);
      const res = await axios.post<Todo>(
        `${API_BASE}/todos`,
        { description: description.trim() },
        config
      );
      setTodos([...todos, res.data]);
      setDescription("");
    } catch (err: any) {
      console.error(err.message);
      setError("Failed to add todo. Please try again.");
    }
  };

  const saveEdit = async (id: number) => {
    try {
      setError(null);
      const currentTodo = todos.find((todo) => todo.todo_id === id);
      if (!currentTodo) return;

      const trimmedText = editedText.trim();
      if (currentTodo.description === trimmedText) {
        setEditingTodo(null);
        setEditedText("");
        return;
      }

      await axios.put(
        `${API_BASE}/todos/${id}`,
        { description: trimmedText },
        config
      );

      setTodos(
        todos.map((todo) =>
          todo.todo_id === id ? { ...todo, description: trimmedText } : todo
        )
      );
      setEditingTodo(null);
      setEditedText("");
    } catch (err: any) {
      console.error(err.message);
      setError("Failed to update todo. Please try again.");
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setError(null);
      await axios.delete(`${API_BASE}/todos/${id}`, config);
      setTodos(todos.filter((todo) => todo.todo_id !== id));
    } catch (err: any) {
      console.error(err.message);
      setError("Failed to delete todo. Please try again.");
    }
  };

  const toggleCompleted = async (id: number) => {
    try {
      setError(null);
      const todo = todos.find((t) => t.todo_id === id);
      if (!todo) return;

      await axios.put(
        `${API_BASE}/todos/${id}`,
        {
          description: todo.description,
          completed: !todo.completed,
        },
        config
      );

      setTodos(
        todos.map((t) =>
          t.todo_id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err: any) {
      console.error(err.message);
      setError("Failed to update todo. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-mahagoni flex justify-center items-center p-4">
      <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-lg p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold font-displaytext-4xl text-transparent bg-clip-text bg-linear-to-r from-orange-500 via-red-500 to-red-700 mb-4">
            FULLSTACK TODO APP
          </h1>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="text-red-500 hover:text-red-700 cursor-pointer mt-4"
          >
            <IoLogOutOutline size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={onSubmitForm}
          className="flex items-center gap-2 shadow-sm border p-2 rounded-lg mb-6"
        >
          <input
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
            type="text"
            value={description}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
            placeholder="What needs to be done?"
            required
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer">
            Add Task
          </button>
        </form>

        <div>
          {loading ? (
            <p className="text-gray-600">Loading tasks...</p>
          ) : todos.length === 0 ? (
            <p className="text-gray-600">No tasks available. Add a new task!</p>
          ) : (
            <div className="flex flex-col gap-y-4">
              {todos.map((todo) => (
                <div key={todo.todo_id} className="pb-4">
                  {editingTodo === todo.todo_id ? (
                    <div className="flex items-center gap-x-3">
                      <input
                        className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner"
                        type="text"
                        value={editedText}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setEditedText(e.target.value)
                        }
                      />
                      <div>
                        <button
                          onClick={() => saveEdit(todo.todo_id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2 mt-2 hover:bg-green-600 duration-200"
                        >
                          <MdOutlineDone />
                        </button>
                        <button
                          onClick={() => setEditingTodo(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg mt-2 hover:bg-gray-600 duration-200"
                        >
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-x-4 overflow-hidden">
                        <button
                          onClick={() => toggleCompleted(todo.todo_id)}
                          className={`shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center ${
                            todo.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {todo.completed && <MdOutlineDone size={16} />}
                        </button>
                        <span
                          className={`${
                            todo.completed ? "line-through text-gray-400" : ""
                          }`}
                        >
                          {todo.description}
                        </span>
                      </div>
                      <div className="flex gap-x-2">
                        <button
                          onClick={() => {
                            setEditingTodo(todo.todo_id);
                            setEditedText(todo.description);
                          }}
                          className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200"
                        >
                          <MdModeEditOutline />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.todo_id)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
