import React, { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export const ProfileView: React.FC = () => {
    const { data } = useTrackerStore();
    const [selectedMetric, setSelectedMetric] = useState<string>('Disciplina');

    // Compute some mock metrics based on user data
    // 1. Constancia (Habits execution rate)
    const totalLogs = data.habitLogs.length;
    const executedLogs = data.habitLogs.filter(l => l.executed).length;
    const constancia = totalLogs === 0 ? 50 : Math.round((executedLogs / totalLogs) * 100);

    // 2. Productividad (Tasks completed vs total)
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter(t => t.completed).length;
    const productividad = totalTasks === 0 ? 50 : Math.round((completedTasks / totalTasks) * 100);

    // 3. Ambición (Total goals + total tasks)
    const ambicion = Math.min(100, (data.goals.length * 10) + (data.tasks.length * 2));

    // 4. Enfoque (Average progress of all active goals)
    const totalGoalProgress = data.goals.reduce((acc, goal) => acc + goal.progress, 0);
    const enfoque = data.goals.length === 0 ? 50 : Math.round(totalGoalProgress / data.goals.length);

    // 5. Vitalidad (Recent habit activity - last 7 days)
    // We'll estimate this by looking at how many habits were executed out of total habits, weighted heavily towards recent activity
    // For simplicity without complex date math, we'll base it on the ratio of executed habits vs total habits, but boosted by overall interactions.
    const vitalidad = Math.min(100, (executedLogs * 3) + 20); // Just a fun formula: more habits logged = more vitality

    // 6. Disciplina (Combination of tasks & habits)
    const disciplina = Math.round((constancia + productividad) / 2);

    const radarData = [
        { subject: 'Constancia', A: constancia, fullMark: 100 },
        { subject: 'Productividad', A: productividad, fullMark: 100 },
        { subject: 'Ambición', A: ambicion, fullMark: 100 },
        { subject: 'Enfoque', A: enfoque, fullMark: 100 },
        { subject: 'Vitalidad', A: vitalidad, fullMark: 100 },
        { subject: 'Disciplina', A: disciplina, fullMark: 100 },
    ];

    const metricsInfo = [
        {
            name: 'Disciplina',
            score: disciplina,
            calc: 'Es el promedio exacto entre tu Constancia en hábitos y tu Productividad en tareas.',
            improvement: 'Para aumentar tu disciplina, debes dominar ambos frentes. No basta con avanzar en tus metas si descuidas tus hábitos diarios. ¡Mantén el equilibrio!'
        },
        {
            name: 'Productividad',
            score: productividad,
            calc: 'Tareas completadas vs el total de tareas creadas en tus metas.',
            improvement: productividad < 50 
                ? 'Tienes muchas tareas acumuladas. Dedica 15 minutos hoy a limpiar y cerrar aquellas que ya no harás.' 
                : '¡Vas bien! Para rozar el 100%, desglosa tus metas en tareas más pequeñas (micro-tareas) para completarlas más rápido.'
        },
        {
            name: 'Constancia',
            score: constancia,
            calc: 'Refleja tu fidelidad al marcar los hábitos programados.',
            improvement: constancia < 60 
                ? 'Estás perdiendo el ritmo. Identifica el hábito más difícil y redúcelo a su versión de 2 minutos para recuperar inercia.' 
                : 'Excelente consistencia. Tu sistema está blindado. Para ser perfecto, recuerda la regla de oro: nunca falles dos días seguidos.'
        },
        {
            name: 'Ambición',
            score: ambicion,
            calc: 'Crece a medida que creas nuevas metas y planeas nuevas tareas.',
            improvement: ambicion < 40
                ? 'Tu sistema está muy tranquilo. ¡Atrévete a soñar más grande! Crea una nueva meta a largo plazo para subir esta estadística.'
                : 'Tienes una visión expansiva. Solo asegúrate de no abarcar más de lo que puedes manejar para no dañar tu Enfoque.'
        },
        {
            name: 'Enfoque',
            score: enfoque,
            calc: 'Es el promedio del progreso de todas tus metas activas.',
            improvement: enfoque < 50
                ? 'Tienes demasiados frentes abiertos. Concéntrate en terminar al menos UNA meta esta semana antes de empezar otra nueva.'
                : 'Sabes lo que quieres y vas directo a ello. Mantén el láser apuntando a tus prioridades.'
        },
        {
            name: 'Vitalidad',
            score: vitalidad,
            calc: 'Recompensa la acción continua. Sube cada vez que completas un hábito.',
            improvement: vitalidad < 50
                ? 'El personaje está cansado. Haz un par de hábitos muy sencillos hoy para revivir la inercia y ganar energía mental.'
                : '¡Estás on fire! Mantener esta energía requiere buen descanso, no te sobreesfuerces.'
        }
    ];

    const activeMetric = metricsInfo.find(m => m.name === selectedMetric) || metricsInfo[0];

    const totalXP = (completedTasks * 10) + (executedLogs * 5);
    const currentLevel = Math.floor(Math.sqrt(totalXP / 10)) + 1;
    const nextLevelXP = 10 * Math.pow(currentLevel, 2);
    const currentLevelBaseXP = 10 * Math.pow(currentLevel - 1, 2);
    const xpProgress = ((totalXP - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100;

    const [showXpInfo, setShowXpInfo] = useState(false);

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10">
            <header className="animate-slide-up" style={{ animationDelay: '0ms' }}>
                <h2 className="text-3xl font-bold tracking-widest uppercase">Perfil del Personaje</h2>
                <p className="text-cde-text-muted mt-2">Tus estadísticas como si fueras un RPG.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Nivel General a la Izquierda */}
                <section className="bg-cde-bg-light border border-cde-border p-8 rounded-xl animate-slide-up shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center relative" style={{ animationDelay: '100ms' }}>
                    <div className="flex justify-between items-center mb-6 border-b border-cde-border pb-4">
                        <h3 className="text-lg tracking-widest uppercase">Nivel General</h3>
                        <button 
                            onClick={() => setShowXpInfo(!showXpInfo)}
                            className="text-cde-text-muted hover:text-cde-text transition-colors w-6 h-6 rounded-full border border-cde-border flex items-center justify-center text-xs font-bold"
                        >
                            ?
                        </button>
                    </div>

                    {showXpInfo && (
                        <div className="absolute top-20 right-8 bg-cde-bg-lighter border border-cde-text p-4 rounded-lg shadow-lg z-10 w-64 text-xs text-cde-text-muted leading-relaxed">
                            <strong className="text-cde-text block mb-1">¿Cómo ganar EXP?</strong>
                            Ganas <strong>10 EXP</strong> por cada tarea completada y <strong>5 EXP</strong> por cada vez que marcas un hábito. El requisito de EXP aumenta exponencialmente cada nivel.
                        </div>
                    )}

                    <div className="flex items-end gap-4 mb-3">
                        <span className="text-7xl font-bold text-cde-text drop-shadow-[0_0_15px_rgba(252,211,209,0.3)] leading-none">Lv. {currentLevel}</span>
                        <div className="pb-2">
                            <span className="text-cde-text-muted tracking-widest uppercase text-sm font-bold block">Arquitecto de Sistemas</span>
                            <span className="text-xs text-cde-text-muted opacity-70">EXP: {totalXP} / {nextLevelXP}</span>
                        </div>
                    </div>
                    
                    <div className="w-full bg-cde-bg-lighter h-3 rounded-full overflow-hidden mt-6">
                        <div className="h-full bg-cde-text transition-all duration-1000 ease-out" style={{ width: `${Math.max(5, xpProgress)}%` }}></div>
                    </div>
                    <p className="text-xs text-center text-cde-text-muted mt-3">Faltan {nextLevelXP - totalXP} EXP para el siguiente nivel</p>
                </section>

                {/* Radar a la Derecha */}
                <section className="bg-cde-bg-light border border-cde-border p-8 rounded-xl flex flex-col items-center justify-center min-h-[350px] animate-slide-up shadow-sm hover:shadow-md transition-shadow" style={{ animationDelay: '200ms' }}>
                    <h3 className="text-lg tracking-widest uppercase mb-4 self-start w-full border-b border-cde-border pb-4">Atributos Base</h3>
                    <div className="w-full h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius={window.innerWidth < 768 ? "60%" : "70%"} data={radarData}>
                                <PolarGrid stroke="#352321" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#d09d9d', fontSize: window.innerWidth < 768 ? 9 : 11, fontFamily: 'monospace' }} />
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
            </div>

            {/* Análisis Abajo, ancho completo */}
            <section className="bg-cde-bg-light border border-cde-border p-8 rounded-xl animate-slide-up shadow-sm hover:shadow-md transition-shadow" style={{ animationDelay: '300ms' }}>
                <h3 className="text-lg tracking-widest uppercase mb-6 border-b border-cde-border pb-4 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cde-text"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    Análisis Táctico
                </h3>
                
                {/* Custom Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {metricsInfo.map(m => (
                        <button 
                            key={m.name}
                            onClick={() => setSelectedMetric(m.name)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${selectedMetric === m.name ? 'bg-cde-text text-cde-bg shadow-[0_0_10px_rgba(252,211,209,0.4)]' : 'bg-cde-bg-lighter text-cde-text-muted border border-cde-border hover:border-cde-text hover:text-cde-text'}`}
                        >
                            {m.name}
                        </button>
                    ))}
                </div>

                {/* Selected Tab Content */}
                <div className="border border-cde-text/30 bg-cde-text/5 p-6 rounded-lg border-l-4 border-l-cde-text animate-fade-in min-h-[140px] max-w-4xl">
                    <h4 className="font-bold text-cde-text mb-3 uppercase tracking-wide text-sm flex justify-between items-center">
                        <span className="text-lg">{activeMetric.name}</span>
                        <span className="text-xl">{activeMetric.score}/100</span>
                    </h4>
                    <p className="text-sm text-cde-text-muted leading-relaxed mb-4">
                        <strong>¿Cómo se mide?</strong> {activeMetric.calc}
                    </p>
                    <div className="text-sm text-white/90 leading-relaxed bg-cde-bg-lighter/50 p-4 rounded border border-cde-border/50 flex gap-4 items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cde-text mt-0.5 shrink-0"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                        <p><strong>Táctica de Mejora:</strong> {activeMetric.improvement}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
