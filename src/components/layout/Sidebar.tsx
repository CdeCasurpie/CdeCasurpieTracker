import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Target, Activity, User, Settings, ExternalLink } from 'lucide-react';
import logoUrl from '../../assets/logo.png';

export const Sidebar: React.FC = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: <Home size={20} />, className: 'nav-dashboard' },
        { path: '/metas', label: 'Metas', icon: <Target size={20} />, className: 'nav-metas' },
        { path: '/habitos', label: 'Hábitos', icon: <Activity size={20} />, className: 'nav-habitos' },
        { path: '/perfil', label: 'Perfil', icon: <User size={20} />, className: 'nav-perfil' },
    ];

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex w-64 bg-cde-bg border-r border-cde-border flex-col h-screen fixed left-0 top-0 z-50 animate-slide-right">
                <div className="p-8 border-b border-cde-border flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-cde-text flex items-center justify-center relative shadow-[0_0_15px_rgba(252,211,209,0.15)] mb-4 overflow-hidden">
                        <img src={logoUrl} alt="César Perales Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-sm font-bold tracking-[0.1em] uppercase text-center leading-tight">César Perales<br/><span className="text-cde-text-muted text-xs">Tracker</span></h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map(item => (
                        <NavLink 
                            key={item.path} 
                            to={item.path}
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-4 py-3 rounded uppercase tracking-widest text-sm transition-colors ${item.className} ${
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

                <div className="p-4 border-t border-cde-border space-y-2">
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
                    
                    <a 
                        href="https://cdecasurpie.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded uppercase tracking-widest text-sm transition-colors text-cde-text-muted hover:text-cde-text hover:bg-cde-bg-light"
                    >
                        <ExternalLink size={20} /> Portafolio
                    </a>
                </div>
            </aside>

            {/* MOBILE BOTTOM NAV */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-cde-bg border-t border-cde-border flex items-center justify-around z-50 pb-4 pt-1 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] animate-slide-up" style={{ animationDelay: '200ms' }}>
                {navItems.map(item => (
                    <NavLink 
                        key={item.path} 
                        to={item.path}
                        className={({ isActive }) => 
                            `flex flex-col items-center gap-1 py-3 px-2 flex-1 transition-colors ${item.className} ${
                                isActive 
                                ? 'text-cde-text' 
                                : 'text-cde-text-muted hover:text-cde-text'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="text-[10px] uppercase tracking-widest">{item.label}</span>
                    </NavLink>
                ))}
                
                <NavLink 
                    to="/configuracion"
                    className={({ isActive }) => 
                        `flex flex-col items-center gap-1 py-3 px-2 flex-1 transition-colors ${
                            isActive 
                            ? 'text-cde-text' 
                            : 'text-cde-text-muted hover:text-cde-text'
                        }`
                    }
                >
                    <Settings size={20} />
                    <span className="text-[10px] uppercase tracking-widest">Ajustes</span>
                </NavLink>

                <a 
                    href="https://cdecasurpie.github.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 py-3 px-2 flex-1 transition-colors text-cde-text-muted hover:text-cde-text"
                >
                    <ExternalLink size={20} />
                    <span className="text-[10px] uppercase tracking-widest">Web</span>
                </a>
            </nav>
        </>
    );
};
