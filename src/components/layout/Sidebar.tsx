import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Target, Activity, User, Settings, Smile } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
        { path: '/metas', label: 'Metas', icon: <Target size={20} /> },
        { path: '/habitos', label: 'Hábitos', icon: <Activity size={20} /> },
        { path: '/perfil', label: 'Perfil', icon: <User size={20} /> },
    ];

    return (
        <aside className="w-64 bg-cde-bg border-r border-cde-border flex flex-col h-screen fixed left-0 top-0">
            <div className="p-8 border-b border-cde-border flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-cde-text flex items-center justify-center relative shadow-[0_0_15px_rgba(252,211,209,0.15)] mb-4">
                    <Smile className="text-cde-text" size={32} />
                </div>
                <h1 className="text-sm font-bold tracking-[0.1em] uppercase text-center leading-tight">César Perales<br/><span className="text-cde-text-muted text-xs">Tracker</span></h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map(item => (
                    <NavLink 
                        key={item.path} 
                        to={item.path}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-3 rounded uppercase tracking-widest text-sm transition-colors ${
                                isActive 
                                ? 'bg-cde-bg-lighter text-cde-text border border-cde-border' 
                                : 'text-cde-text-muted hover:text-cde-text hover:bg-cde-bg-light'
                            }`
                        }
                    >
                        {item.icon} {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-cde-border">
                <NavLink 
                    to="/configuracion"
                    className={({ isActive }) => 
                        `flex items-center gap-3 px-4 py-3 rounded uppercase tracking-widest text-sm transition-colors ${
                            isActive 
                            ? 'bg-cde-bg-lighter text-cde-text border border-cde-border' 
                            : 'text-cde-text-muted hover:text-cde-text hover:bg-cde-bg-light'
                        }`
                    }
                >
                    <Settings size={20} /> Ajustes
                </NavLink>
            </div>
        </aside>
    );
};
