import { useState } from "react";
import Login from "./Login";
import TodoApp from "./TodoApp";

function App() {
  // token kann string oder null sein
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loggedOut, setLoggedOut] = useState(false);

  if (loggedOut) {
    setTimeout(() => setLoggedOut(false), 3000);
    return (
      <div className="min-h-screen flex items-center justify-center bg-mahagoni text-white text-xl">
        Du wurdest erfolgreich ausgeloggt!
      </div>
    );
  }

  if (!token) {
    // setToken ist eine Funktion, die string | null erwartet
    return <Login setToken={setToken} />;
  }

  return (
    <TodoApp token={token} setToken={setToken} setLoggedOut={setLoggedOut} />
  );
}

export default App;
