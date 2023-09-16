import React from "react";
import "./App.css";
import Weather from "./components/Weather";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My City Climate</h1>
      </header>
      <main>
        <Weather />
      </main>
      <Footer />
    </div>
  );
}

export default App;
