import React, { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { Download, Upload, AlertTriangle } from 'lucide-react';

export const SettingsView: React.FC = () => {
    const { exportData, importData } = useTrackerStore();
    const [msg, setMsg] = useState('');

    const handleExport = () => {
        const data = exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cdecasurpie_tracker_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setMsg('Datos exportados exitosamente.');
        setTimeout(() => setMsg(''), 3000);
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
                    setMsg('Datos importados correctamente.');
                    setTimeout(() => setMsg(''), 3000);
                } catch (err) {
                    setMsg('Error al importar datos. Revisa el archivo JSON.');
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-3xl">
            <header>
                <h2 className="text-3xl font-bold tracking-widest uppercase">Configuración</h2>
                <p className="text-cde-text-muted mt-2">Administra tus datos locales.</p>
            </header>

            {msg && (
                <div className="bg-cde-text/10 border border-cde-text text-cde-text p-4 rounded text-sm">
                    {msg}
                </div>
            )}

            <section className="bg-cde-bg-light border border-cde-border p-8 rounded-lg space-y-6">
                <div>
                    <h3 className="text-lg tracking-widest uppercase mb-2">Exportar Datos</h3>
                    <p className="text-sm text-cde-text-muted mb-4">Descarga todo tu progreso en formato JSON para que no dependas de servidores. Guárdalo seguro.</p>
                    <button onClick={handleExport} className="border border-cde-text px-6 py-2 rounded hover:bg-cde-text hover:text-cde-bg transition-colors flex items-center gap-2">
                        <Download size={16} /> Descargar JSON
                    </button>
                </div>

                <hr className="border-cde-border" />

                <div>
                    <h3 className="text-lg tracking-widest uppercase mb-2 flex items-center gap-2">
                        Importar Datos <AlertTriangle size={16} className="text-yellow-500" />
                    </h3>
                    <p className="text-sm text-cde-text-muted mb-4">Carga un archivo JSON previamente exportado. Esto sobrescribirá todos los datos actuales del navegador.</p>
                    <label className="border border-cde-text px-6 py-2 rounded hover:bg-cde-text hover:text-cde-bg transition-colors flex items-center gap-2 cursor-pointer inline-flex">
                        <Upload size={16} /> Seleccionar JSON
                        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                    </label>
                </div>
            </section>
        </div>
    );
};
