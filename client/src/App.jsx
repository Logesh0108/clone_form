import { Routes, Route } from "react-router-dom";

import GoogleForm from "./pages/GoogleForm";
import SuccessPage from "./pages/SuccessPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GoogleForm />} />
      <Route path="/submitted" element={<SuccessPage />} />
    </Routes>
  );
}

export default App;