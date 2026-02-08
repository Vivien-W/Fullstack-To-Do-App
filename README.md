# 🍃 LeafList – Moderne Full-Stack To-Do App

LeafList ist eine moderne, ruhige und bewusst minimalistisch gestaltete To-Do-Webanwendung.
Das Projekt wurde als Full-Stack-Portfolio-Projekt entwickelt und legt besonderen Wert auf
saubere Architektur, TypeScript-Typisierung, Testbarkeit und ein hochwertiges Nutzererlebnis.

---

## Inhaltsverzeichnis

- [Projektidee & Motivation](#projektidee--motivation)
- [Funktionen](#funktionen)
- [Technologien](#technologien)
- [Architektur](#architektur)
- [Setup & Installation](#setup--installation)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Tests](#tests)
- [Datenbank](#datenbank)
- [API-Dokumentation](#api-dokumentation)
- [Was habe ich gerlernt](#learning)

---

## Projektidee & Motivation

Ziel dieses Projekts war es, eine **realistische, produktionsnahe Web-App** zu entwickeln,
die typische Anforderungen moderner Anwendungen abbildet:

- Benutzer-Authentifizierung
- Rechtebasierter Datenzugriff
- CRUD-Operationen
- saubere Trennung von Frontend & Backend
- automatisierte Tests

Das Projekt wurde zunächst in **JavaScript** umgesetzt und anschließend schrittweise
in **TypeScript** migriert, um Typensicherheit, Wartbarkeit und Codequalität zu verbessern.

---

---

## Funktionen

- Benutzerregistrierung und Login (JWT-basiert)
- Erstellung, Bearbeitung und Löschung von Todos
- Todos sind **nur für den jeweiligen Benutzer sichtbar**
- Status „erledigt / offen“
- Ruhiges, nicht ablenkendes UI mit Fokus auf Usability
- Vollständig getestete API-Endpunkte
- Separate Test-Datenbank

---

 Web Tokens)
- Jest + Supertest
- dotenv

---

## Architektur

- Das Frontend kommuniziert über eine REST-API mit dem Backend
- Authentifizierung erfolgt über JWT im Authorization-Header
- Das Backend prüft Benutzerrechte serverseitig
- PostgreSQL als relationale Datenbank mit Foreign Keys
- Klare Trennung von Produktions- und Testumgebung

---

## Setup & Installation

### Voraussetzungen
- Node.js (>= 18)
- PostgreSQL
- npm

---

### Backend starten

cd backend
npm install
npm run start

localhost: 🚀 Server läuft im undefined Modus auf Port 5000

### Frontend starten
npm install
npm run dev

Frontend läuft auf: http://localhost:5173

---

## Umgebungsvariablen

Im Backend wird eine .env Datei benötigt:

DATABASE_URL=postgresql://user:password@localhost:5432/leaflist
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/leaflist_test
JWT_SECRET=your_secret_key
PORT=5000

---

## Tests

Backend: Jest + Supertest

Frontend: Vitest + Testing Library

- Separate Test-Datenbank für sichere Integrationstests

- Tests decken Authentifizierung und CRUD-Operationen ab

Tests ausführen: npm run test

---

## Datenbank

users

| Spalte   | Typ    | Beschreibung       |
| -------- | ------ | ------------------ |
| user_id  | SERIAL | Primärschlüssel    |
| username | TEXT   | Benutzername       |
| password | TEXT   | Gehashtes Passwort |

todos

| Spalte      | Typ     | Beschreibung           |
| ----------- | ------- | ---------------------- |
| todo_id     | SERIAL  | Primärschlüssel        |
| user_id     | INTEGER | Fremdschlüssel (users) |
| description | TEXT    | Todo-Beschreibung      |
| completed   | BOOLEAN | Erledigt-Status        |

## API-Dokumentation

### Authentifizierung
JWT wird im Header gesendet:
Authorization: Bearer <token>

### Todos
GET /todos
→ Alle Todos des angemeldeten Benutzers

POST /todos
→ Neues Todo erstellen
{ "description": "Mein Todo" }

PUT /todos/:id
→ Todo aktualisieren
{ "description": "Aktualisiert", "completed": true }

DELETE /todos/:id
→ Todo löschen

## Was habe ich gelernt?

Durch die Entwicklung von LeafList konnte ich zentrale Aspekte moderner Webentwicklung
praxisnah vertiefen:

- **Saubere Frontend–Backend-Trennung:**  
  Klare Verantwortlichkeiten zwischen UI, Business-Logik und Datenpersistenz
  erleichtern Wartbarkeit und Erweiterbarkeit erheblich.

- **Typensicherheit mit TypeScript:**  
  Die schrittweise Migration von JavaScript zu TypeScript hat mir gezeigt,
  wie stark Typisierung dabei hilft, Fehler frühzeitig zu erkennen und APIs klar zu definieren.

- **Authentifizierung & Sicherheit:**  
  Umsetzung einer JWT-basierten Authentifizierung inklusive geschützter Routen
  und serverseitiger Rechteprüfung.

- **Testbarkeit & Qualität:**  
  Schreiben von Unit- und Integrationstests für Backend-Endpunkte sowie UI-Komponenten
  im Frontend, inklusive Nutzung einer separaten Test-Datenbank.

- **State-Management & Re-Renders:**  
  Bewusster Umgang mit React State, Re-Renders und Komponenten-Isolation
  (z. B. Trennung von UI-Logik und Hintergrundanimationen).

- **User Experience & Designentscheidungen:**  
  Fokus auf ruhige, nicht ablenkende Gestaltung, die Produktivität unterstützt,
  statt Effekte in den Vordergrund zu stellen.

- **Projektstruktur & Iteration:**  
  Arbeiten in kleinen, nachvollziehbaren Schritten mit kontinuierlicher Verbesserung
  von Code, Architektur und UI.

Dieses Projekt hat mir ein realistisches Verständnis dafür vermittelt,
wie sich technische Entscheidungen direkt auf Nutzererlebnis und Wartbarkeit auswirken.
