import React, { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { PlusCircle, CheckSquare, Square, Minus, Trash2 } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

export const HabitsView: React.FC = () => {
    const { data, addHabit, toggleHabitLog, updateHabit, deleteHabit } = useTrackerStore();
    const [newHabitName, setNewHabitName] = useState('');
    const [scheduleType, setScheduleType] = useState<'daily' | 'custom'>('daily');
    const [customSchedule, setCustomSchedule] = useState({ L: true, M: true, Mi: true, J: true, V: true, S: true, D: false });

    const handleAddHabit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newHabitName.trim()) {
            const finalSchedule = scheduleType === 'daily' 
                ? { L: true, M: true, Mi: true, J: true, V: true, S: true, D: true }
                : customSchedule;
            
            addHabit(newHabitName, finalSchedule);
            setNewHabitName('');
            setScheduleType('daily');
            setCustomSchedule({ L: true, M: true, Mi: true, J: true, V: true, S: true, D: false });
        }
    };

    const toggleCustomDay = (day: keyof typeof customSchedule) => {
        setCustomSchedule(prev => ({ ...prev, [day]: !prev[day] }));
    };

    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));
    const dayLabels = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'] as const;

    const getHabitLogForDate = (habitId: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return data.habitLogs.find(l => l.habitId === habitId && l.date === dateStr);
    };

    return (
        <div className="space-y-12 animate-fade-in max-w-7xl mx-auto">
            <header className="animate-slide-up" style={{ animationDelay: '0ms' }}>
                <h2 className="text-3xl font-bold tracking-widest uppercase">Gestión de Hábitos</h2>
                <p className="text-cde-text-muted mt-2">Tu progreso semanal y configuración.</p>
            </header>

            <section className="bg-cde-bg-light border border-cde-border p-8 rounded-xl overflow-x-auto shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-cde-bg-lighter border-b border-cde-border text-sm tracking-wider text-cde-text-muted">
                            <th className="p-4 font-normal uppercase">Hábito</th>
                            {weekDays.map((date, i) => (
                                <th key={i} className="p-4 font-normal text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="uppercase text-[10px] tracking-widest">{dayLabels[i]}</span>
                                        <span className={`text-xl font-medium ${isSameDay(date, today) ? 'text-cde-text font-bold bg-cde-bg rounded-full w-8 h-8 flex items-center justify-center border border-cde-text/30 shadow-[0_0_10px_rgba(252,211,209,0.1)]' : 'w-8 h-8 flex items-center justify-center'}`}>
                                            {format(date, 'd')}
                                        </span>
                                    </div>
                                </th>
                            ))}
                            <th className="p-4 font-normal text-center uppercase">Progreso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.habits.length === 0 && (
                            <tr>
                                <td colSpan={9} className="p-8 text-center text-cde-text-muted text-sm italic">Sin hábitos registrados.</td>
                            </tr>
                        )}
                        {data.habits.map((habit, idx) => {
                            let totalScheduled = 0;
                            let executedDays = 0;

                            const dayMapping = { 0: 'D', 1: 'L', 2: 'M', 3: 'Mi', 4: 'J', 5: 'V', 6: 'S' } as const;

                            // Calculate progress based strictly on scheduled days
                            weekDays.forEach((date) => {
                                const dayIndex = date.getDay() as keyof typeof dayMapping;
                                const dayKey = dayMapping[dayIndex];
                                
                                if (habit.schedule[dayKey as keyof typeof habit.schedule]) {
                                    totalScheduled++;
                                    if (getHabitLogForDate(habit.id, date)?.executed) {
                                        executedDays++;
                                    }
                                }
                            });

                            const progress = totalScheduled === 0 ? 0 : Math.round((executedDays / totalScheduled) * 100);

                            return (
                                <tr key={habit.id} className="border-b border-cde-border hover:bg-cde-bg-lighter/50 transition-colors group animate-slide-up" style={{ animationDelay: `${200 + idx * 50}ms` }}>
                                    <td className="p-4 font-medium group-hover:text-cde-text transition-colors flex items-center justify-between gap-4">
                                        <span>{habit.name}</span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => {
                                                const newName = window.prompt("Editar hábito:", habit.name);
                                                if (newName && newName.trim()) {
                                                    updateHabit(habit.id, newName.trim(), habit.schedule);
                                                }
                                            }} className="text-cde-border hover:text-cde-text hover:scale-110 active:scale-90 transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                            </button>
                                            <button onClick={() => {
                                                if (window.confirm(`¿Estás seguro de eliminar el hábito "${habit.name}"? Se perderá todo su registro.`)) {
                                                    deleteHabit(habit.id);
                                                }
                                            }} className="text-cde-border hover:text-red-400 hover:scale-110 active:scale-90 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                    {weekDays.map((date, i) => {
                                        const dayIndex = date.getDay() as keyof typeof dayMapping;
                                        const dayKey = dayMapping[dayIndex];
                                        const isScheduled = habit.schedule[dayKey as keyof typeof habit.schedule];
                                        const log = getHabitLogForDate(habit.id, date);
                                        const isExecuted = log?.executed || false;

                                        return (
                                            <td key={i} className="p-4 text-center">
                                                {!isScheduled ? (
                                                    <div className="flex justify-center text-cde-border/50"><Minus size={20} /></div>
                                                ) : (
                                                    <button 
                                                        onClick={() => toggleHabitLog(habit.id, date)} 
                                                        className={`transition-all active:scale-90 hover:scale-110 ${isExecuted ? 'text-cde-text opacity-70 hover:opacity-100' : 'text-cde-text-muted hover:text-white'}`}
                                                    >
                                                        {isExecuted ? <CheckSquare size={24} /> : <Square size={24} />}
                                                    </button>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3 justify-center">
                                            <div className="w-20 bg-cde-bg-lighter h-2.5 rounded-full overflow-hidden">
                                                <div className="h-full bg-cde-text transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
                                            </div>
                                            <span className="text-xs w-8 text-right font-bold">{progress}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            <section className="bg-cde-bg-light border border-cde-border p-8 rounded-xl animate-slide-up shadow-sm" style={{ animationDelay: '300ms' }}>
                <h3 className="text-xl tracking-widest uppercase mb-8 border-b border-cde-border pb-4">Crear Nuevo Hábito</h3>
                <form onSubmit={handleAddHabit} className="flex flex-col gap-8">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-cde-text-muted mb-3 font-bold">Nombre del hábito</label>
                        <input 
                            type="text" 
                            value={newHabitName}
                            onChange={e => setNewHabitName(e.target.value)}
                            placeholder="Ej. Meditar 10 min..." 
                            className="bg-cde-bg-lighter border border-cde-border px-5 py-3 rounded-lg focus:outline-none focus:border-cde-text focus:ring-1 focus:ring-cde-text w-full max-w-md transition-all"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-cde-text-muted mb-4 font-bold">Frecuencia</label>
                        <div className="flex gap-6 mb-6">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="radio" checked={scheduleType === 'daily'} onChange={() => setScheduleType('daily')} className="accent-cde-text w-4 h-4" />
                                <span className="text-sm group-hover:text-white transition-colors">Todos los días</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="radio" checked={scheduleType === 'custom'} onChange={() => setScheduleType('custom')} className="accent-cde-text w-4 h-4" />
                                <span className="text-sm group-hover:text-white transition-colors">Personalizado</span>
                            </label>
                        </div>

                        {scheduleType === 'custom' && (
                            <div className="flex flex-wrap gap-4 animate-fade-in">
                                {dayLabels.map(day => (
                                    <button 
                                        type="button"
                                        key={day}
                                        onClick={() => toggleCustomDay(day as keyof typeof customSchedule)}
                                        className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-all active:scale-95 ${
                                            customSchedule[day as keyof typeof customSchedule] 
                                                ? 'bg-cde-text text-cde-bg border-cde-text shadow-[0_0_10px_rgba(252,211,209,0.3)]' 
                                                : 'bg-cde-bg-lighter text-cde-text-muted border-cde-border hover:border-cde-text hover:text-cde-text'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="self-start border border-cde-text bg-cde-bg-lighter px-8 py-3 rounded-lg hover:bg-cde-text hover:text-cde-bg transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest text-sm mt-4 font-medium">
                        <PlusCircle size={18} /> Guardar
                    </button>
                </form>
            </section>
        </div>
    );
};
