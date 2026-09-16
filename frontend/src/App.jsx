import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Error from "./pages/Error.jsx";
import Auth from "./pages/Auth.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import DoubtDetail from "./pages/DoubtDetail.jsx";
import Add from "./pages/Add.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/doubt/:id" element={<DoubtDetail />} />
        <Route path="/add" element={<Add />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
