import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppProvider from "./contexts/AppContext/AppProvider";
import Home from "./pages/Home";

function App() {

  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster position="top-right" containerStyle={{ zIndex: 1000000 }} />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
