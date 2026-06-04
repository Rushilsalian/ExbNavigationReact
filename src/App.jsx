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
import ExhibitorSearch from "./pages/ExhibitorSearch";
import KioskSync from "./pages/KioskSync";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hall-upload" element={<HallUpload />} />
          <Route path="/booth-mapping" element={<BoothMapping />} />
          <Route path="/navigation-editor" element={<NavigationEditor />} />
          <Route path="/exhibitors" element={<ExhibitorSearch />} />
          <Route path="/kiosk-sync" element={<KioskSync />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
