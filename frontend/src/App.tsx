import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Notes } from "./pages/Notes";
import { NoteDetail } from "./pages/NoteDetail";
import { RecoverPassword } from "./pages/RecoverPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
