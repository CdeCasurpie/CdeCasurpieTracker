import React, { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { PlusCircle, CheckCircle, Circle, Trash2, CheckSquare, Square } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';

export const Dashboard: React.FC = () => {
    const { data, addTask, toggleTask, addGoal, deleteTask, addHabit, toggleHabitLog } = useTrackerStore();
    const [newGoalDesc, setNewGoalDesc] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [selectedGoalId, setSelectedGoalId] = useState('');
    const [newHabitName, setNewHabitName] = useState('');

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalDesc.trim()) {
            addGoal(newGoalDesc, 'General', new Date().toISOString());
            setNewGoalDesc('');
        }
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskDesc.trim() && selectedGoalId) {
            addTask(selectedGoalId, newTaskDesc, new Date().toISOString());
            setNewTaskDesc('');
        }
    };

    const handleAddHabit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newHabitName.trim()) {
            addHabit(newHabitName, { L: true, M: true, Mi: true, J: true, V: true, S: true, D: true });
            setNewHabitName('');
        }
    };

    // Calculate current week dates (Monday to Sunday)
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Monday
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));
    const dayLabels = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];

    const getHabitLogForDate = (habitId: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return data.habitLogs.find(l => l.habitId === habitId && l.date === dateStr);
    };

    return (
        <div className="px-6 md:px-12 pb-12 max-w-7xl mx-auto space-y-12">
            
            {/* Metas Section */}
            <section>
                <div className="flex items-center justify-between mb-6 border-b border-cde-border pb-2">
                    <h2 className="text-xl tracking-widest uppercase">Mis Metas</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.goals.length === 0 && <p className="text-cde-text-muted text-sm italic">No hay metas registradas.</p>}
                    {data.goals.map(goal => (
                        <div key={goal.id} className="bg-cde-bg-light p-6 border border-cde-border rounded-lg shadow-lg relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold truncate pr-4">{goal.description}</h3>
                                <span className="text-xs px-2 py-1 bg-cde-bg-lighter border border-cde-border rounded uppercase tracking-wider">{goal.status}</span>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="w-full bg-cde-bg-lighter h-2 rounded-full overflow-hidden mb-2">
                                <div 
                                    className="h-full bg-cde-text transition-all duration-500 ease-out"
                                    style={{ width: `${goal.progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-cde-text-muted">
                                <span>Progreso</span>
                                <span>{goal.progress}%</span>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAddGoal} className="mt-6 flex gap-4">
                    <input 
                        type="text" 
                        value={newGoalDesc}
                        onChange={e => setNewGoalDesc(e.target.value)}
                        placeholder="Nueva meta..." 
                        className="bg-cde-bg-light border border-cde-border px-4 py-2 rounded focus:outline-none focus:border-cde-text flex-1"
                    />
                    <button type="submit" className="border border-cde-text px-4 py-2 rounded hover:bg-cde-text hover:text-cde-bg transition-colors flex items-center gap-2">
                        <PlusCircle size={16} /> Añadir
                    </button>
                </form>
            </section>

            {/* Hábitos Section (Heatmap) */}
            <section>
                <div className="flex items-center justify-between mb-6 border-b border-cde-border pb-2">
                    <h2 className="text-xl tracking-widest uppercase">Progreso de Hábitos</h2>
                </div>
                
                <div className="bg-cde-bg-light border border-cde-border rounded-lg overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
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
                                // Calculate weekly progress
                                const executedDays = weekDays.filter(date => getHabitLogForDate(habit.id, date)?.executed).length;
                                const totalScheduled = 7; // For simplicity, assuming all 7 days for now. In a full version we'd check habit.schedule
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
                                                <div className="w-16 bg-cde-bg-lighter h-2 rounded-full overflow-hidden">
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
                </div>

                <form onSubmit={handleAddHabit} className="mt-6 flex gap-4">
                    <input 
                        type="text" 
                        value={newHabitName}
                        onChange={e => setNewHabitName(e.target.value)}
                        placeholder="Nuevo hábito..." 
                        className="bg-cde-bg-light border border-cde-border px-4 py-2 rounded focus:outline-none focus:border-cde-text flex-1"
                    />
                    <button type="submit" className="border border-cde-text px-4 py-2 rounded hover:bg-cde-text hover:text-cde-bg transition-colors flex items-center gap-2">
                        <PlusCircle size={16} /> Añadir Hábito
                    </button>
                </form>
            </section>

            {/* Tareas Section */}
            <section>
                <div className="flex items-center justify-between mb-6 border-b border-cde-border pb-2">
                    <h2 className="text-xl tracking-widest uppercase">Próximas Tareas</h2>
                </div>
                
                <div className="bg-cde-bg-light border border-cde-border rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-cde-bg-lighter border-b border-cde-border text-sm uppercase tracking-wider text-cde-text-muted">
                                <th className="p-4 font-normal">Estado</th>
                                <th className="p-4 font-normal">Descripción</th>
                                <th className="p-4 font-normal">Meta Asociada</th>
                                <th className="p-4 font-normal text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.tasks.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-cde-text-muted text-sm italic">Sin tareas pendientes.</td>
                                </tr>
                            )}
                            {data.tasks.map(task => {
                                const parentGoal = data.goals.find(g => g.id === task.goalId);
                                return (
                                    <tr key={task.id} className="border-b border-cde-border hover:bg-cde-bg-lighter/50 transition-colors">
                                        <td className="p-4 w-16">
                                            <button onClick={() => toggleTask(task.id)} className="text-cde-text hover:text-white transition-colors">
                                                {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                                            </button>
                                        </td>
                                        <td className={`p-4 ${task.completed ? 'line-through text-cde-text-muted' : ''}`}>
                                            {task.description}
                                        </td>
                                        <td className="p-4 text-sm text-cde-text-muted">
                                            {parentGoal?.description || 'N/A'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => deleteTask(task.id)} className="text-cde-text-muted hover:text-red-400 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <form onSubmit={handleAddTask} className="mt-6 flex flex-col md:flex-row gap-4">
                    <select 
                        value={selectedGoalId} 
                        onChange={e => setSelectedGoalId(e.target.value)}
                        className="bg-cde-bg-light border border-cde-border px-4 py-2 rounded focus:outline-none focus:border-cde-text"
                    >
                        <option value="">-- Seleccionar Meta --</option>
                        {data.goals.map(g => <option key={g.id} value={g.id}>{g.description}</option>)}
                    </select>
                    <input 
                        type="text" 
                        value={newTaskDesc}
                        onChange={e => setNewTaskDesc(e.target.value)}
                        placeholder="Nueva tarea..." 
                        className="bg-cde-bg-light border border-cde-border px-4 py-2 rounded focus:outline-none focus:border-cde-text flex-1"
                    />
                    <button type="submit" className="border border-cde-text px-4 py-2 rounded hover:bg-cde-text hover:text-cde-bg transition-colors flex items-center justify-center gap-2">
                        <PlusCircle size={16} /> Añadir Tarea
                    </button>
                </form>
            </section>
        </div>
    );
};
