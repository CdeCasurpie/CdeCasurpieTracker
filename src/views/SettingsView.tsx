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
        <div className="space-y-12 animate-fade-in max-w-3xl mx-auto">
            <header className="animate-slide-up" style={{ animationDelay: '0ms' }}>
                <h2 className="text-3xl font-bold tracking-widest uppercase">Configuración</h2>
                <p className="text-cde-text-muted mt-2">Administra tus datos locales.</p>
            </header>

            {msg && (
                <div className="bg-cde-text/10 border border-cde-text text-cde-text p-4 rounded-lg text-sm font-medium animate-slide-up">
                    {msg}
                </div>
            )}

            <section className="bg-cde-bg-light border border-cde-border p-10 rounded-xl space-y-10 animate-slide-up shadow-sm" style={{ animationDelay: '100ms' }}>
                <div className="group">
                    <h3 className="text-xl tracking-widest uppercase mb-3 group-hover:text-cde-text transition-colors">Exportar Datos</h3>
                    <p className="text-sm text-cde-text-muted mb-6 leading-relaxed">Descarga todo tu progreso en formato JSON para que no dependas de servidores. Guárdalo seguro.</p>
                    <button onClick={handleExport} className="border border-cde-text bg-cde-bg-lighter px-8 py-3 rounded-lg hover:bg-cde-text hover:text-cde-bg transition-all active:scale-95 flex items-center gap-3 font-medium">
                        <Download size={18} /> Descargar JSON
                    </button>
                </div>

                <hr className="border-cde-border" />

                <div className="group">
                    <h3 className="text-xl tracking-widest uppercase mb-3 flex items-center gap-3 group-hover:text-cde-text transition-colors">
                        Importar Datos <AlertTriangle size={18} className="text-yellow-500 animate-pulse" />
                    </h3>
                    <p className="text-sm text-cde-text-muted mb-6 leading-relaxed">Carga un archivo JSON previamente exportado. Esto sobrescribirá todos los datos actuales del navegador.</p>
                    <label className="border border-cde-text bg-cde-bg-lighter px-8 py-3 rounded-lg hover:bg-cde-text hover:text-cde-bg transition-all active:scale-95 flex items-center gap-3 cursor-pointer inline-flex font-medium">
                        <Upload size={18} /> Seleccionar JSON
                        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                    </label>
                </div>
                <hr className="border-cde-border" />

                <div className="group">
                    <h3 className="text-xl tracking-widest uppercase mb-3 group-hover:text-cde-text transition-colors">Tutorial Guiado</h3>
                    <p className="text-sm text-cde-text-muted mb-6 leading-relaxed">¿Olvidaste cómo funciona la aplicación o simplemente quieres ver la animación de nuevo? Puedes volver a tomar el recorrido guiado.</p>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('cde_tutorial_completed');
                            window.location.hash = '/';
                            window.location.reload();
                        }} 
                        className="border border-cde-text bg-cde-bg-lighter px-8 py-3 rounded-lg hover:bg-cde-text hover:text-cde-bg transition-all active:scale-95 flex items-center gap-3 font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> 
                        Volver a ver el Tutorial
                    </button>
                </div>
            </section>
        </div>
    );
};
