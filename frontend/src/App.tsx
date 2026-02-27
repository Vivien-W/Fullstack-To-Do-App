import { useState } from "react";
import Login from "./Login";
import TodoApp from "./TodoApp";
import LeafBackground from "./LeafBackground";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
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

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🍂 Hintergrund läuft IMMER, unabhängig von App-State */}
      <LeafBackground />

      <main className="relative z-10 flex items-center justify-center min-h-screen">
        {!token ? (
          <Login setToken={setToken} />
        ) : (
          <TodoApp
            token={token}
            setToken={setToken}
            setLoggedOut={setLoggedOut}
          />
        )}
      </main>
    </div>
  );
}

export default App;
