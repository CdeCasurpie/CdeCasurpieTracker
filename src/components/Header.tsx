import React from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { Download, Upload, Smile } from 'lucide-react';

export const Header: React.FC = () => {
    const { exportData, importData } = useTrackerStore();

    const handleExport = () => {
        const data = exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cdecasurpie_tracker_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                try {
                    importData(content);
                    alert('Datos importados correctamente.');
                } catch (err) {
                    alert('Error al importar datos. Revisa el archivo.');
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <header className="flex flex-col md:flex-row items-center justify-between py-8 px-6 md:px-12 border-b border-cde-border mb-8">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-12 h-12 rounded-full border border-cde-text flex items-center justify-center relative shadow-[0_0_15px_rgba(252,211,209,0.15)]">
                    <Smile className="text-cde-text" size={24} />
                </div>
                <div>
                    <h1 className="text-sm md:text-base font-bold tracking-[0.2em] uppercase">COMPUTER SCIENTIST | SYSTEMS ENGINEER</h1>
                    <h2 className="text-xl md:text-2xl mt-1 tracking-widest">CÉSAR PERALES</h2>
                </div>
            </div>

            <nav className="flex items-center gap-6 text-sm tracking-widest uppercase">
                <a href="#" className="hover:text-cde-text-muted transition-colors">Dashboard</a>
                <a href="#" className="hover:text-cde-text-muted transition-colors">Metas</a>
                <button onClick={handleExport} className="hover:text-cde-text-muted transition-colors flex items-center gap-2">
                    <Download size={16} /> Export
                </button>
                <label className="hover:text-cde-text-muted transition-colors flex items-center gap-2 cursor-pointer">
                    <Upload size={16} /> Import
                    <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                </label>
            </nav>
        </header>
    );
};
