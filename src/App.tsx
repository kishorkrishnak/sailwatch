import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppProvider from "./contexts/AppContext/AppProvider";
import Home from "./pages/Home";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
