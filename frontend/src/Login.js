import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useState } from "react";
import axios from "axios";
export default function Login({ setToken }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
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
    } catch (err) {
      setMessage("❌ Fehler: " + (err.response?.data?.error || err.message));
    }
  };
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  return _jsxs("div", {
    className:
      "relative min-h-screen flex flex-col items-center justify-center overflow-hidden",
    children: [
      _jsxs("div", {
        className: "flex flex-col items-center mb-6",
        children: [
          _jsx("img", {
            src: "/Logo.jpg",
            alt: "LeafList Logo",
            className: "h-14 w-14",
          }),
          _jsx("p", {
            className: "text-s font-display text-olive/70 tracking-wide mt-2",
            children: "\u201ESch\u00F6n, dass du wieder da bist.\u201C",
          }),
        ],
      }),
      _jsxs("div", {
        className:
          "bg-card/90 backdrop-blur-sm rounded-(--radius-card)] shadow-2xl w-full max-w-lg p-12 border border-olive",
        children: [
          _jsx("h1", {
            className:
              "text-3xl font-display font-extrabold text-center mb-6 text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-dark",
            children: mode === "login" ? "Login" : "Registrieren",
          }),
          message &&
            _jsx("p", {
              className:
                "mb-4 text-center text-text bg-white/50 border border-olive/30 rounded-lg py-2",
              children: message,
            }),
          _jsxs("form", {
            className: "flex flex-col gap-3",
            onSubmit: handleSubmit,
            children: [
              _jsx("input", {
                type: "text",
                placeholder: "Username",
                className:
                  "px-4 py-3 rounded-(--radius-button)] border border-olive/40 bg-white/70 text-text placeholder-olive/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40",
                value: username,
                onChange: handleUsernameChange,
                required: true,
              }),
              _jsx("input", {
                type: "password",
                placeholder: "Passwort",
                className:
                  "px-4 py-3 rounded-(--radius-button)] border border-olive/40 bg-white/70 text-text placeholder-olive/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40",
                value: password,
                onChange: handlePasswordChange,
                required: true,
              }),
              _jsx("button", {
                className:
                  "bg-accent hover:bg-accent-dark text-white py-3 rounded-(--radius-button)] font-medium transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer",
                children: mode === "login" ? "Einloggen" : "Registrieren",
              }),
            ],
          }),
          _jsx("p", {
            className: "mt-6 text-center text-sm text-text/80",
            children:
              mode === "login"
                ? _jsxs(_Fragment, {
                    children: [
                      "Noch keinen Account?",
                      " ",
                      _jsx("button", {
                        className:
                          "text-accent hover:text-accent-dark font-medium underline underline-offset-2 transition-colors cursor-pointer",
                        type: "button",
                        onClick: () => setMode("register"),
                        children: "Registrieren",
                      }),
                    ],
                  })
                : _jsxs(_Fragment, {
                    children: [
                      "Schon registriert?",
                      " ",
                      _jsx("button", {
                        className:
                          "text-accent hover:text-accent-dark font-medium underline underline-offset-2 transition-colors",
                        type: "button",
                        onClick: () => setMode("login"),
                        children: "Einloggen",
                      }),
                    ],
                  }),
          }),
        ],
      }),
      _jsxs("footer", {
        className:
          "absolute bottom-2 w-full flex justify-center gap-6 text-sm text-olive/80",
        children: [
          _jsx("a", {
            href: "/impressum",
            className: "hover:text-accent transition-colors",
            children: "Impressum",
          }),
          _jsx("a", {
            href: "/faq",
            className: "hover:text-accent transition-colors",
            children: "FAQ",
          }),
          _jsx("a", {
            href: "https://facebook.com/deinFacebookName",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hover:text-accent transition-colors",
            children: "Facebook",
          }),
          _jsx("a", {
            href: "https://instagram.com/in/deinProfil",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hover:text-accent transition-colors",
            children: "Instagram",
          }),
        ],
      }),
    ],
  });
}
