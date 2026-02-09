import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose, IoLogOutOutline } from "react-icons/io5";
export default function TodoApp({ token, setToken, setLoggedOut, }) {
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [editingTodo, setEditingTodo] = useState(null);
    const [editedText, setEditedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_BASE = import.meta.env.VITE_API_BASE;
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
            const res = await axios.get(`${API_BASE}/todos`, config);
            setTodos(res.data);
        }
        catch (err) {
            console.error(err.message);
            setError("Failed to fetch todos. Please try again later.");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getTodos();
    }, []);
    const onSubmitForm = async (e) => {
        e.preventDefault();
        if (!description.trim())
            return;
        try {
            setError(null);
            const res = await axios.post(`${API_BASE}/todos`, { description: description.trim() }, config);
            setTodos([...todos, res.data]);
            setDescription("");
        }
        catch (err) {
            console.error(err.message);
            setError("Failed to add todo. Please try again.");
        }
    };
    const saveEdit = async (id) => {
        try {
            setError(null);
            const currentTodo = todos.find((todo) => todo.todo_id === id);
            if (!currentTodo)
                return;
            const trimmedText = editedText.trim();
            if (currentTodo.description === trimmedText) {
                setEditingTodo(null);
                setEditedText("");
                return;
            }
            await axios.put(`${API_BASE}/todos/${id}`, { description: trimmedText }, config);
            setTodos(todos.map((todo) => todo.todo_id === id ? { ...todo, description: trimmedText } : todo));
            setEditingTodo(null);
            setEditedText("");
        }
        catch (err) {
            console.error(err.message);
            setError("Failed to update todo. Please try again.");
        }
    };
    const deleteTodo = async (id) => {
        try {
            setError(null);
            await axios.delete(`${API_BASE}/todos/${id}`, config);
            setTodos(todos.filter((todo) => todo.todo_id !== id));
        }
        catch (err) {
            console.error(err.message);
            setError("Failed to delete todo. Please try again.");
        }
    };
    const toggleCompleted = async (id) => {
        try {
            setError(null);
            const todo = todos.find((t) => t.todo_id === id);
            if (!todo)
                return;
            await axios.put(`${API_BASE}/todos/${id}`, {
                description: todo.description,
                completed: !todo.completed,
            }, config);
            setTodos(todos.map((t) => t.todo_id === id ? { ...t, completed: !t.completed } : t));
        }
        catch (err) {
            console.error(err.message);
            setError("Failed to update todo. Please try again.");
        }
    };
    return (_jsx("div", { className: "relative min-h-screen flex items-center justify-center overflow-hidden", children: _jsxs("div", { className: "bg-card/90 backdrop-blur-sm rounded-(--radius-card)] shadow-2xl w-full max-w-lg p-8 border border-olive", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: "/Logo.jpg", alt: "LeafList Logo", className: "h-8 w-8 rounded-full shadow-sm" }), _jsx("h1", { className: "text-2xl font-display font-bold bg-clip-text text-transparent bg-linear-to-r from-accent to-accent-dark", children: "LeafList" })] }), _jsx("button", { onClick: handleLogout, "aria-label": "Logout", className: "text-accent hover:text-accent-dark transition-transform hover:scale-110 cursor-pointer", children: _jsx(IoLogOutOutline, { size: 24 }) })] }), error && (_jsx("div", { className: "bg-red-100 text-red-700 p-3 rounded mb-4", children: error })), _jsxs("form", { onSubmit: onSubmitForm, className: "flex items-center gap-2 border border-olive/40 bg-white/70 shadow-sm p-2 rounded-(--radius-button)] mb-6", children: [_jsx("input", { className: "flex-1 bg-transparent outline-none px-3 py-2 text-text placeholder-olive/70", type: "text", value: description, onChange: (e) => setDescription(e.target.value), placeholder: "What needs to be done?", required: true }), _jsx("button", { className: "bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-(--radius-button)] transition-all font-medium shadow cursor-pointer", children: "Add Task" })] }), _jsx("div", { children: loading ? (_jsx("p", { className: "text-gray-600", children: "Loading tasks..." })) : todos.length === 0 ? (_jsx("p", { className: "text-gray-600", children: "No tasks available. Add a new task!" })) : (_jsx("div", { className: "flex flex-col gap-y-4", children: todos.map((todo) => (_jsx("div", { className: "pb-4", children: editingTodo === todo.todo_id ? (_jsxs("div", { className: "flex items-center gap-x-3", children: [_jsx("input", { className: "flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner", type: "text", value: editedText, onChange: (e) => setEditedText(e.target.value) }), _jsxs("div", { children: [_jsx("button", { onClick: () => saveEdit(todo.todo_id), className: "px-4 py-2 bg-green-500 text-white rounded-lg mr-2 mt-2 hover:bg-green-600 duration-200", children: _jsx(MdOutlineDone, {}) }), _jsx("button", { onClick: () => setEditingTodo(null), className: "px-4 py-2 bg-gray-500 text-white rounded-lg mt-2 hover:bg-gray-600 duration-200", children: _jsx(IoClose, {}) })] })] })) : (_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-x-4 overflow-hidden", children: [_jsx("button", { onClick: () => toggleCompleted(todo.todo_id), className: `shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center ${todo.completed
                                                    ? "bg-green-500 border-green-500 text-white"
                                                    : "border-gray-300 hover:border-blue-400"}`, children: todo.completed && _jsx(MdOutlineDone, { size: 16 }) }), _jsx("span", { className: `${todo.completed ? "line-through text-gray-400" : ""}`, children: todo.description })] }), _jsxs("div", { className: "flex gap-x-2", children: [_jsx("button", { onClick: () => {
                                                    setEditingTodo(todo.todo_id);
                                                    setEditedText(todo.description);
                                                }, className: "p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200", children: _jsx(MdModeEditOutline, {}) }), _jsx("button", { onClick: () => deleteTodo(todo.todo_id), className: "p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200", children: _jsx(FaTrash, {}) })] })] })) }, todo.todo_id))) })) })] }) }));
}
