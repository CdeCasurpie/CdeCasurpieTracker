import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './views/DashboardView';
import { GoalsView } from './views/GoalsView';
import { HabitsView } from './views/HabitsView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-cde-bg text-cde-text font-mono selection:bg-cde-text selection:text-cde-bg">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 md:p-12 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/metas" element={<GoalsView />} />
            <Route path="/habitos" element={<HabitsView />} />
            <Route path="/perfil" element={<ProfileView />} />
            <Route path="/configuracion" element={<SettingsView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
