import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import HallUpload from "./pages/HallUpload";
import BoothMapping from "./pages/BoothMapping";
import NavigationEditor from "./pages/NavigationEditor";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/hall-upload"
            element={<HallUpload />}
          />

          <Route
            path="/booth-mapping"
            element={<BoothMapping />}
          />

          <Route
            path="/navigation-editor"
            element={<NavigationEditor />}
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;