// src/App.tsx

import "./App.css";
import { GlobalProvider } from "./context/GlobalContext";
import Header from "./components/Header";
import Content from "./components/Content";
import Footer from "./components/Footer";

function App() {
  return (
    <GlobalProvider>
      <div className="h-screen flex flex-col">
        <Header />
        <Content />
        <Footer />
      </div>
    </GlobalProvider>
  );
}

export default App;
