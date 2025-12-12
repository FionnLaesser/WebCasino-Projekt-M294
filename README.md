<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

# WEBCASINO-PROJEKT-M294

<em>Spannung entfesseln, täglich Gewinnerlebnisse ermöglichen</em>

<!-- BADGES -->
<img src="https://img.shields.io/github/last-commit/FionnLaesser/WebCasino-Projekt-M294?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<img src="https://img.shields.io/github/languages/top/FionnLaesser/WebCasino-Projekt-M294?style=flat&color=0080ff" alt="repo-top-language">
<img src="https://img.shields.io/github/languages/count/FionnLaesser/WebCasino-Projekt-M294?style=flat&color=0080ff" alt="repo-language-count">

<em>Erstellt mit folgenden Tools und Technologien:</em>

<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/Markdown-000000.svg?style=flat&logo=Markdown&logoColor=white" alt="Markdown">
<img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/Vitest-6E9F18.svg?style=flat&logo=Vitest&logoColor=white" alt="Vitest">
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">

</div>
<br>

---

## Inhaltsverzeichnis

- [Übersicht](#overview)
- [Erste Schritte](#getting-started)
    - [Voraussetzungen](#prerequisites)
    - [Installation](#installation)
    - [Nutzung](#usage)
    - [Tests](#testing)
- [Funktionen](#features)
- [Projektstruktur](#project-structure)

---

## Übersicht

WebCasino-Projekt-M294 ist ein auf React basierendes Framework zum Erstellen ansprechender und skalierbarer Online-Casino-Oberflächen. Es vereint interaktive Spielkomponenten, Verwaltungsfunktionen und moderne Entwicklungstools, um die Erstellung immersiver webbasierter Glücksspiel-Erlebnisse zu vereinfachen.

**Warum WebCasino-Projekt-M294?**

Dieses Projekt soll Entwicklern eine stabile Grundlage für wartbare, funktionsreiche Casino-Anwendungen bieten. Die Kernmerkmale sind:

- **🧩** Modulare React-Architektur für flexible Komponentenverwaltung
- **🎰** Interaktive Spielkomponenten wie Roulette und Slots für fesselnde Nutzererlebnisse
- **🛠️** Moderne Tools mit Vite und Vitest für schnelle Entwicklung und verlässliche Tests
- **🔧** Konfigurierbare Spielmechaniken, Auszahlungstabellen und Admin-Steuerungen zur Anpassung
- **🌐** Nahtlose API-Integration für dynamische Nutzerdaten und Spielzustände
- **🚀** Skalierbares Design für zukünftige Erweiterungen und neue Funktionen

---

## Funktionen

|      | Komponente           | Details                                                                                     |
| :--- | :------------------- | :------------------------------------------------------------------------------------------ |
| ⚙️  | **Architektur**      | <ul><li>Client-seitig gerenderte SPA mit React</li><li>Verwendung von React Router für die Navigation</li><li>Vite als Build-Tool für schnelle Entwicklung</li></ul> |
| 🔩 | **Code-Qualität**    | <ul><li>Konsequenter Code-Stil (ESLint)</li><li>Keine Verwendung von TypeScript; nur JavaScript</li><li>Modulare Komponentenstruktur mit Funktionskomponenten</li></ul> |
| 📄 | **Dokumentation**    | <ul><li>Basis-README mit Projektübersicht</li><li>Inline-Kommentare im Code</li><li>Begrenzte externe Dokumentation oder API-Dokumente</li></ul> |
| 🔌 | **Integrationen**     | <ul><li>React-Bibliotheken: react-router-dom, @vitejs/plugin-react</li><li>Tests mit @testing-library/react, vitest, @testing-library/jest-dom</li><li>Build mit Vite</li></ul> |
| 🧩 | **Modularität**       | <ul><li>Komponentenbasierte Architektur</li><li>Wiederverwendbare React-Komponenten</li><li>Trennung von UI und Geschäftslogik</li></ul> |
| 🧪 | **Testing**           | <ul><li>Unit-Tests mit Vitest</li><li>UI-Tests mit @testing-library/react</li><li>Testabdeckung ist vorhanden, aber begrenzt</li></ul> |
| ⚡️  | **Performance**      | <ul><li>Vite bietet schnelles Hot Module Replacement</li><li>Code-Splitting ist nicht explizit konfiguriert</li><li>Insgesamt kleines Bundle</li></ul> |
| 🛡️ | **Sicherheit**       | <ul><li>Keine expliziten Sicherheitsfeatures implementiert</li><li>Grundlegende clientseitige Validierung</li></ul> |
| 📦 | **Abhängigkeiten**    | <ul><li>Kern: react, react-dom, react-router-dom, vite</li><li>Testing: @testing-library/react, vitest, jsdom</li><li>Build: @vitejs/plugin-react</li></ul> |

---

## Projektstruktur

```sh
└── WebCasino-Projekt-M294/
    ├── README.md
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── src
    │   ├── App.jsx
    │   ├── api.js
    │   ├── assets
    │   ├── components
    │   ├── index.css
    │   ├── main.jsx
    │   ├── pages
    │   ├── slotConfig.js
    │   ├── styles
    │   └── styles.css
    ├── svg
    │   └── Casino.svg
    └── vite.config.js
```

---

## Erste Schritte

### Backend (erforderlich)

Bevor Sie das Frontend starten, müssen Sie das Backend aus dem folgenden Repository herunterladen und starten:

1. **Backend-Repository klonen:**

```sh
git clone https://github.com/WISS-GB/M294-MongoDB-API
cd M294-MongoDB-API
```

2. **Backend starten (Docker Compose):**

```sh
docker compose up -d
```

Warten Sie, bis die Container vollständig gestartet sind. Erst wenn das Backend läuft, fahren Sie mit dem Frontend fort (siehe unten).

### Voraussetzungen

Dieses Projekt benötigt folgende Voraussetzungen:

- **Programmiersprache:** JavaScript
- **Paketmanager:** npm

### Installation

Baue WebCasino-Projekt-M294 aus dem Quellcode und installiere die Abhängigkeiten:

1. **Repository klonen:**

    ```sh
    ❯ git clone https://github.com/FionnLaesser/WebCasino-Projekt-M294
    ```

2. **Ins Projektverzeichnis wechseln:**

    ```sh
    ❯ cd WebCasino-Projekt-M294
    ```

3. **Abhängigkeiten installieren:**

**Mit [npm](https://www.npmjs.com/):**

```sh
❯ npm install
```

### Nutzung

Starte das Projekt mit:

**Mit [npm](https://www.npmjs.com/):**

```sh
npm run dev
```

### Tests

WebCasino-Projekt-M294 verwendet das Testframework {__test_framework__}. Führe die Testsuite mit folgendem Befehl aus:

**Mit [npm](https://www.npmjs.com/):**

```sh
npm test
```

---

## Hilfestellung und Quellen

### Tools und Ressourcen

- **[ChatGPT](https://chatgpt.com/)** – Hilfe bei Fehlern, Code-Erklärungen, Styles und Animationen sowie Ideenfindung
- **Claudia Monstein** – SUS-Berechner-Vorlage und Fragen des SUS-Tests
- **[Gitdocify](https://www.gitdocify.com/)** – Tool zur Erstellung eines professionellen README.md
- **[M294-MongoDB-API (Sven Schirmer)](https://github.com/WISS-GB/M294-MongoDB-API)** – Generische Backend-REST-API für MongoDB

### Erlerntes Wissen

- Unterricht bei Sven Schirmer
- YouTube-Tutorials
- [Wikipedia](https://www.wikipedia.org/)
- [ChatGPT](https://chatgpt.com/)
- [React-Dokumentation](https://www.w3schools.com/react/)

### Grafiken & Assets

- **[SVG-Icon](https://www.svgrepo.com/svg/422175/casino-lucky-machine-2)** der Projektwebseite

---

<div align="left"><a href="#top">⬆ Zurück</a></div>

---
