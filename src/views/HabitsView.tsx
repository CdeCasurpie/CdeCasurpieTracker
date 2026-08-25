import React, { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { PlusCircle, CheckSquare, Square, Minus } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

export const HabitsView: React.FC = () => {
    const { data, addHabit, toggleHabitLog } = useTrackerStore();
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
        <div className="space-y-12 animate-fade-in">
            <header>
                <h2 className="text-3xl font-bold tracking-widest uppercase">Gestión de Hábitos</h2>
                <p className="text-cde-text-muted mt-2">Tu progreso semanal y configuración.</p>
            </header>

            <section className="bg-cde-bg-light border border-cde-border p-6 rounded-lg overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-cde-bg-lighter border-b border-cde-border text-sm tracking-wider text-cde-text-muted">
                            <th className="p-4 font-normal uppercase">Hábito</th>
                            {weekDays.map((date, i) => (
                                <th key={i} className="p-4 font-normal text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="uppercase text-xs">{dayLabels[i]}</span>
                                        <span className={`text-lg ${isSameDay(date, today) ? 'text-cde-text font-bold' : ''}`}>
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
                                <td colSpan={9} className="p-4 text-center text-cde-text-muted text-sm italic">Sin hábitos registrados.</td>
                            </tr>
                        )}
                        {data.habits.map(habit => {
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
                                <tr key={habit.id} className="border-b border-cde-border hover:bg-cde-bg-lighter/50 transition-colors">
                                    <td className="p-4 font-medium">{habit.name}</td>
                                    {weekDays.map((date, i) => {
                                        const dayIndex = date.getDay() as keyof typeof dayMapping;
                                        const dayKey = dayMapping[dayIndex];
                                        const isScheduled = habit.schedule[dayKey as keyof typeof habit.schedule];
                                        const log = getHabitLogForDate(habit.id, date);
                                        const isExecuted = log?.executed || false;

                                        return (
                                            <td key={i} className="p-4 text-center">
                                                {!isScheduled ? (
                                                    <div className="flex justify-center text-cde-border"><Minus size={20} /></div>
                                                ) : (
                                                    <button 
                                                        onClick={() => toggleHabitLog(habit.id, date)} 
                                                        className={`transition-colors ${isExecuted ? 'text-cde-text' : 'text-cde-text-muted hover:text-white'}`}
                                                    >
                                                        {isExecuted ? <CheckSquare size={22} /> : <Square size={22} />}
                                                    </button>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 justify-center">
                                            <div className="w-16 bg-cde-bg-lighter h-2 rounded-full overflow-hidden">
                                                <div className="h-full bg-cde-text transition-all" style={{ width: `${progress}%` }}></div>
                                            </div>
                                            <span className="text-xs w-8 text-right">{progress}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            <section className="bg-cde-bg-light border border-cde-border p-6 rounded-lg">
                <h3 className="text-lg tracking-widest uppercase mb-6">Crear Nuevo Hábito</h3>
                <form onSubmit={handleAddHabit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm uppercase tracking-widest text-cde-text-muted mb-2">Nombre del hábito</label>
                        <input 
                            type="text" 
                            value={newHabitName}
                            onChange={e => setNewHabitName(e.target.value)}
                            placeholder="Ej. Meditar 10 min..." 
                            className="bg-cde-bg-lighter border border-cde-border px-4 py-2 rounded focus:outline-none focus:border-cde-text w-full max-w-md"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm uppercase tracking-widest text-cde-text-muted mb-3">Frecuencia</label>
                        <div className="flex gap-4 mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" checked={scheduleType === 'daily'} onChange={() => setScheduleType('daily')} className="accent-cde-text" />
                                <span className="text-sm">Todos los días</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" checked={scheduleType === 'custom'} onChange={() => setScheduleType('custom')} className="accent-cde-text" />
                                <span className="text-sm">Personalizado</span>
                            </label>
                        </div>

                        {scheduleType === 'custom' && (
                            <div className="flex gap-3">
                                {dayLabels.map(day => (
                                    <button 
                                        type="button"
                                        key={day}
                                        onClick={() => toggleCustomDay(day as keyof typeof customSchedule)}
                                        className={`w-10 h-10 rounded border flex items-center justify-center text-sm font-bold transition-colors ${
                                            customSchedule[day as keyof typeof customSchedule] 
                                                ? 'bg-cde-text text-cde-bg border-cde-text' 
                                                : 'bg-cde-bg-lighter text-cde-text-muted border-cde-border hover:border-cde-text'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="self-start border border-cde-text px-6 py-2 rounded hover:bg-cde-text hover:text-cde-bg transition-colors flex items-center gap-2 uppercase tracking-widest text-sm mt-4">
                        <PlusCircle size={16} /> Guardar
                    </button>
                </form>
            </section>
        </div>
    );
};
