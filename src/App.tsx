import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-cde-bg text-cde-text font-mono selection:bg-cde-text selection:text-cde-bg">
      <Header />
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
