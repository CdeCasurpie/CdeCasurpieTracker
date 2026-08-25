import React, { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { PlusCircle, CheckSquare, Square } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

export const HabitsView: React.FC = () => {
    const { data, addHabit, toggleHabitLog } = useTrackerStore();
    const [newHabitName, setNewHabitName] = useState('');

    const handleAddHabit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newHabitName.trim()) {
            addHabit(newHabitName, { L: true, M: true, Mi: true, J: true, V: true, S: true, D: true });
            setNewHabitName('');
        }
    };

    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));
    const dayLabels = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];

    const getHabitLogForDate = (habitId: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return data.habitLogs.find(l => l.habitId === habitId && l.date === dateStr);
    };

    return (
        <div className="space-y-12 animate-fade-in">
            <header>
                <h2 className="text-3xl font-bold tracking-widest uppercase">Gestión de Hábitos</h2>
                <p className="text-cde-text-muted mt-2">Tu progreso semanal y métricas de consistencia.</p>
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
                            <th className="p-4 font-normal text-center uppercase">Progreso Semanal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.habits.length === 0 && (
                            <tr>
                                <td colSpan={9} className="p-4 text-center text-cde-text-muted text-sm italic">Sin hábitos registrados.</td>
                            </tr>
                        )}
                        {data.habits.map(habit => {
                            const executedDays = weekDays.filter(date => getHabitLogForDate(habit.id, date)?.executed).length;
                            const totalScheduled = 7; 
                            const progress = Math.round((executedDays / totalScheduled) * 100);

                            return (
                                <tr key={habit.id} className="border-b border-cde-border hover:bg-cde-bg-lighter/50 transition-colors">
                                    <td className="p-4 font-medium">{habit.name}</td>
                                    {weekDays.map((date, i) => {
                                        const log = getHabitLogForDate(habit.id, date);
                                        const isExecuted = log?.executed || false;
                                        return (
                                            <td key={i} className="p-4 text-center">
                                                <button 
                                                    onClick={() => toggleHabitLog(habit.id, date)} 
                                                    className={`transition-colors ${isExecuted ? 'text-cde-text' : 'text-cde-text-muted hover:text-white'}`}
                                                >
                                                    {isExecuted ? <CheckSquare size={22} /> : <Square size={22} />}
                                                </button>
                                            </td>
                                        );
                                    })}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 justify-center">
                                            <div className="w-20 bg-cde-bg-lighter h-2 rounded-full overflow-hidden">
                                                <div className="h-full bg-cde-text transition-all" style={{ width: `${progress}%` }}></div>
                                            </div>
                                            <span className="text-xs w-8">{progress}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            <section>
                <form onSubmit={handleAddHabit} className="flex gap-4">
                    <input 
                        type="text" 
                        value={newHabitName}
                        onChange={e => setNewHabitName(e.target.value)}
                        placeholder="Crear nuevo hábito (ej. Meditar 10 min)..." 
                        className="bg-cde-bg-light border border-cde-border px-4 py-3 rounded focus:outline-none focus:border-cde-text flex-1"
                    />
                    <button type="submit" className="border border-cde-text px-8 py-3 rounded hover:bg-cde-text hover:text-cde-bg transition-colors flex items-center gap-2 uppercase tracking-widest text-sm">
                        <PlusCircle size={18} /> Añadir Hábito
                    </button>
                </form>
            </section>
        </div>
    );
};
