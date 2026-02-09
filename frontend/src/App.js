import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Login from "./Login";
import TodoApp from "./TodoApp";
import LeafBackground from "./LeafBackground"; // <-- hier importieren
function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loggedOut, setLoggedOut] = useState(false);
    if (loggedOut) {
        setTimeout(() => setLoggedOut(false), 3000);
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-mahagoni text-white text-xl", children: "Du wurdest erfolgreich ausgeloggt!" }));
    }
    return (_jsxs("div", { className: "relative min-h-screen overflow-hidden", children: [_jsx(LeafBackground, {}), _jsx("main", { className: "relative z-10 flex items-center justify-center min-h-screen", children: !token ? (_jsx(Login, { setToken: setToken })) : (_jsx(TodoApp, { token: token, setToken: setToken, setLoggedOut: setLoggedOut })) })] }));
}
export default App;
