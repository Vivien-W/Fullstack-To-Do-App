import { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";

// Props-Typ für setToken
interface LoginProps {
  setToken: (token: string | null) => void;
}

export default function Login({ setToken }: LoginProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = `http://localhost:5000/auth/${mode}`;
      const res = await axios.post(url, { username, password });

      if (mode === "login") {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setMessage("✅ Login erfolgreich!");
      } else {
        setMessage(
          "✅ Registrierung erfolgreich! Jetzt kannst du dich einloggen."
        );
        setMode("login");
      }
    } catch (err: any) {
      setMessage("❌ Fehler: " + (err.response?.data?.error || err.message));
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  return (
    <div className="min-h-screen flex items-center justify-center bg-mahagoni">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Login" : "Registrieren"}
        </h1>

        {message && <p className="mb-4 text-center text-gray-700">{message}</p>}

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="border p-2 rounded"
            value={username}
            onChange={handleUsernameChange}
            required
          />
          <input
            type="password"
            placeholder="Passwort"
            className="border p-2 rounded"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            {mode === "login" ? "Einloggen" : "Registrieren"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {mode === "login" ? (
            <>
              Noch keinen Account?{" "}
              <button
                className="text-blue-500 underline"
                type="button"
                onClick={() => setMode("register")}
              >
                Registrieren
              </button>
            </>
          ) : (
            <>
              Schon registriert?{" "}
              <button
                className="text-blue-500 underline"
                type="button"
                onClick={() => setMode("login")}
              >
                Einloggen
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
