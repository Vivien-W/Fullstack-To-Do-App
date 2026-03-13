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
      const API_BASE = import.meta.env.VITE_API_BASE;

      const url = `${API_BASE}/auth/${mode}`;

      const res = await axios.post(url, { username, password });

      if (mode === "login") {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setMessage("✅ Login erfolgreich!");
      } else {
        setMessage(
          "✅ Registrierung erfolgreich! Jetzt kannst du dich einloggen.",
        );
        setMode("login");
      }
    } catch (err: any) {
      console.error(err);

      let message = "Something went wrong";

      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          message = err.response.data;
        } else if (err.response.data.error) {
          message =
            typeof err.response.data.error === "string"
              ? err.response.data.error
              : JSON.stringify(err.response.data.error);
        } else if (err.response.data.message) {
          message = err.response.data.message;
        }
      } else if (err.message) {
        message = err.message;
      }

      setMessage("❌ " + message);
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Logo + Subtitle */}
      <div className="flex flex-col items-center mb-6">
        <img src="/Logo.jpg" alt="LeafList Logo" className="h-14 w-14" />

        <p className="text-s font-display text-olive/70 tracking-wide mt-2">
          „Schön, dass du wieder hier bist.“
        </p>
      </div>

      <div className="bg-card/90 backdrop-blur-sm rounded-(--radius-card)] shadow-2xl w-full max-w-lg p-12 border border-olive">
        <h1 className="text-3xl font-display font-extrabold text-center mb-6 text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-dark">
          {mode === "login" ? "Login" : "Registrieren"}
        </h1>

        {message && (
          <p className="mb-4 text-center text-text bg-white/50 border border-olive/30 rounded-lg py-2">
            {message}
          </p>
        )}

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-3 rounded-(--radius-button)] border border-olive/40 bg-white/70 text-text placeholder-olive/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            value={username}
            onChange={handleUsernameChange}
            required
          />
          <input
            type="password"
            placeholder="Passwort"
            className="px-4 py-3 rounded-(--radius-button)] border border-olive/40 bg-white/70 text-text placeholder-olive/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button className="bg-accent hover:bg-accent-dark text-white py-3 rounded-(--radius-button)] font-medium transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer">
            {mode === "login" ? "Einloggen" : "Registrieren"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text/80">
          {mode === "login" ? (
            <>
              Noch keinen Account?{" "}
              <button
                className="text-accent hover:text-accent-dark font-medium underline underline-offset-2 transition-colors cursor-pointer"
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
                className="text-accent hover:text-accent-dark font-medium underline underline-offset-2 transition-colors"
                type="button"
                onClick={() => setMode("login")}
              >
                Einloggen
              </button>
            </>
          )}
        </p>
      </div>
      <footer className="absolute bottom-4 w-full flex justify-center gap-6 text-sm text-olive/80">
        <a href="/impressum" className="hover:text-accent transition-colors">
          Impressum
        </a>
        <a href="/faq" className="hover:text-accent transition-colors">
          FAQ
        </a>
        <a
          href="https://facebook.com/deinFacebookName"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >
          Facebook
        </a>
        <a
          href="https://instagram.com/in/deinProfil"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >
          Instagram
        </a>
      </footer>
    </div>
  );
}
