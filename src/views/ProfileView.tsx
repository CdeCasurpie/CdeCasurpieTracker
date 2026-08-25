import React from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export const ProfileView: React.FC = () => {
    const { data } = useTrackerStore();

    // Compute some mock metrics based on user data
    // 1. Constancia (Habits execution rate)
    const totalLogs = data.habitLogs.length;
    const executedLogs = data.habitLogs.filter(l => l.executed).length;
    const constancia = totalLogs === 0 ? 50 : Math.round((executedLogs / totalLogs) * 100);

    // 2. Productividad (Tasks completed vs total)
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter(t => t.completed).length;
    const productividad = totalTasks === 0 ? 50 : Math.round((completedTasks / totalTasks) * 100);

    // 3. Ambición (Total goals)
    const ambicion = Math.min(100, data.goals.length * 10 + 20);

    // 4. Enfoque (General category goals completion)
    // 5. Vitalidad (Mocking a stat just for flavor)
    // 6. Disciplina (Combination of tasks & habits)

    const radarData = [
        { subject: 'Constancia', A: constancia, fullMark: 100 },
        { subject: 'Productividad', A: productividad, fullMark: 100 },
        { subject: 'Ambición', A: ambicion, fullMark: 100 },
        { subject: 'Enfoque', A: 85, fullMark: 100 },
        { subject: 'Vitalidad', A: 90, fullMark: 100 },
        { subject: 'Disciplina', A: Math.round((constancia + productividad) / 2), fullMark: 100 },
    ];

    return (
        <div className="space-y-12 animate-fade-in max-w-7xl mx-auto">
            <header className="animate-slide-up" style={{ animationDelay: '0ms' }}>
                <h2 className="text-3xl font-bold tracking-widest uppercase">Perfil del Personaje</h2>
                <p className="text-cde-text-muted mt-2">Tus estadísticas como si fueras un RPG.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-cde-bg-light border border-cde-border p-8 rounded-xl flex flex-col items-center justify-center min-h-[400px] animate-slide-up shadow-sm hover:shadow-md transition-shadow" style={{ animationDelay: '100ms' }}>
                    <h3 className="text-xl tracking-widest uppercase mb-8 self-start w-full border-b border-cde-border pb-4">Tus Atributos</h3>
                    <div className="w-full h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#352321" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#d09d9d', fontSize: 12, fontFamily: 'monospace' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="César"
                                    dataKey="A"
                                    stroke="#fcd3d1"
                                    fill="#fcd3d1"
                                    fillOpacity={0.2}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="space-y-8">
                    <div className="bg-cde-bg-light border border-cde-border p-8 rounded-xl animate-slide-up shadow-sm hover:shadow-md transition-shadow" style={{ animationDelay: '200ms' }}>
                        <h3 className="text-lg tracking-widest uppercase mb-6 border-b border-cde-border pb-4">Nivel General</h3>
                        <div className="flex items-end gap-4 mb-3">
                            <span className="text-6xl font-bold text-cde-text drop-shadow-[0_0_15px_rgba(252,211,209,0.3)]">Lv. {Math.round((constancia + productividad) / 20) + 1}</span>
                            <span className="text-cde-text-muted mb-2 tracking-widest uppercase text-sm font-bold">Arquitecto de Sistemas</span>
                        </div>
                        <p className="text-sm text-cde-text-muted">Sigue completando tareas y hábitos para ganar EXP.</p>
                    </div>

                    <div className="bg-cde-bg-light border border-cde-border p-8 rounded-xl animate-slide-up shadow-sm hover:shadow-md transition-shadow" style={{ animationDelay: '300ms' }}>
                        <h3 className="text-lg tracking-widest uppercase mb-6 border-b border-cde-border pb-4">Métricas Clave</h3>
                        <div className="space-y-6">
                            <div className="group">
                                <div className="flex justify-between text-sm mb-2 font-bold group-hover:text-cde-text transition-colors">
                                    <span>Tasa de Tareas Completadas</span>
                                    <span>{productividad}%</span>
                                </div>
                                <div className="w-full bg-cde-bg-lighter h-2.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-cde-text transition-all duration-1000 ease-out" style={{ width: `${productividad}%` }}></div>
                                </div>
                            </div>
                            <div className="group">
                                <div className="flex justify-between text-sm mb-2 font-bold group-hover:text-cde-text transition-colors">
                                    <span>Constancia en Hábitos</span>
                                    <span>{constancia}%</span>
                                </div>
                                <div className="w-full bg-cde-bg-lighter h-2.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-cde-text transition-all duration-1000 ease-out" style={{ width: `${constancia}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
