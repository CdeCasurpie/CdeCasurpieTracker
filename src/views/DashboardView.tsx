import React, { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { Circle, CheckSquare, Square, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

export const DashboardView: React.FC = () => {
    const { data, toggleTask, toggleHabitLog, addTask } = useTrackerStore();
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [selectedGoalId, setSelectedGoalId] = useState('');

    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    const handleAddImmediateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskDesc.trim() && selectedGoalId) {
            addTask(selectedGoalId, newTaskDesc, todayStr);
            setNewTaskDesc('');
        }
    };

    // Filter tasks (for simplicity, showing all non-completed tasks or tasks completed today)
    // In a real app we'd filter by deadline === today
    const pendingTasks = data.tasks.filter(t => !t.completed);
    const completedTasksCount = data.tasks.filter(t => t.completed).length;
    
    // Habits for today
    const getHabitLogForToday = (habitId: string) => {
        return data.habitLogs.find(l => l.habitId === habitId && l.date === todayStr);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="mb-8">
                <h2 className="text-3xl font-bold tracking-widest uppercase">Resumen Diario</h2>
                <p className="text-cde-text-muted mt-2">{format(today, 'dd/MM/yyyy')} - Mantén el enfoque.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Immediate Tasks */}
                <section className="bg-cde-bg-light border border-cde-border p-6 rounded-lg">
                    <h3 className="text-xl tracking-widest uppercase border-b border-cde-border pb-4 mb-4">Tareas de Hoy</h3>
                    
                    <form onSubmit={handleAddImmediateTask} className="mb-6 flex flex-col gap-3">
                        <select 
                            value={selectedGoalId} 
                            onChange={e => setSelectedGoalId(e.target.value)}
                            className="bg-cde-bg-lighter border border-cde-border px-3 py-2 rounded focus:outline-none focus:border-cde-text w-full text-sm"
                            required
                        >
                            <option value="">-- Vincular a Meta --</option>
                            {data.goals.map(g => <option key={g.id} value={g.id}>{g.description}</option>)}
                        </select>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newTaskDesc}
                                onChange={e => setNewTaskDesc(e.target.value)}
                                placeholder="Añadir tarea rápida..." 
                                className="bg-cde-bg-lighter border border-cde-border px-3 py-2 rounded focus:outline-none focus:border-cde-text flex-1 text-sm"
                                required
                            />
                            <button type="submit" className="border border-cde-text px-3 py-2 rounded hover:bg-cde-text hover:text-cde-bg transition-colors flex items-center justify-center">
                                <PlusCircle size={18} />
                            </button>
                        </div>
                    </form>

                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {pendingTasks.length === 0 && <p className="text-sm italic text-cde-text-muted">¡Todo al día!</p>}
                        {pendingTasks.map(task => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-cde-bg-lighter border border-cde-border rounded hover:border-cde-text transition-colors">
                                <button onClick={() => toggleTask(task.id)} className="text-cde-text hover:text-white">
                                    <Circle size={20} />
                                </button>
                                <span className="flex-1 text-sm">{task.description}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Daily Habits */}
                <section className="bg-cde-bg-light border border-cde-border p-6 rounded-lg">
                    <h3 className="text-xl tracking-widest uppercase border-b border-cde-border pb-4 mb-4">Hábitos del Día</h3>
                    
                    <div className="space-y-3">
                        {data.habits.length === 0 && <p className="text-sm italic text-cde-text-muted">No hay hábitos configurados.</p>}
                        {data.habits.map(habit => {
                            const isExecuted = getHabitLogForToday(habit.id)?.executed || false;
                            return (
                                <div key={habit.id} className="flex items-center justify-between p-4 bg-cde-bg-lighter border border-cde-border rounded transition-colors hover:border-cde-text">
                                    <span className={`font-medium ${isExecuted ? 'text-cde-text-muted line-through' : ''}`}>{habit.name}</span>
                                    <button 
                                        onClick={() => toggleHabitLog(habit.id, today)} 
                                        className={`transition-colors ${isExecuted ? 'text-cde-text' : 'text-cde-text-muted hover:text-white'}`}
                                    >
                                        {isExecuted ? <CheckSquare size={24} /> : <Square size={24} />}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
            
            {/* Quick KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-cde-bg-light border border-cde-border p-4 rounded text-center">
                    <p className="text-cde-text-muted text-xs tracking-widest uppercase mb-1">Metas Activas</p>
                    <p className="text-2xl font-bold">{data.goals.filter(g => g.status === 'En Curso').length}</p>
                </div>
                <div className="bg-cde-bg-light border border-cde-border p-4 rounded text-center">
                    <p className="text-cde-text-muted text-xs tracking-widest uppercase mb-1">Tareas Completadas</p>
                    <p className="text-2xl font-bold">{completedTasksCount}</p>
                </div>
                <div className="bg-cde-bg-light border border-cde-border p-4 rounded text-center">
                    <p className="text-cde-text-muted text-xs tracking-widest uppercase mb-1">Hábitos Hoy</p>
                    <p className="text-2xl font-bold">{data.habits.filter(h => getHabitLogForToday(h.id)?.executed).length} / {data.habits.length}</p>
                </div>
            </div>
        </div>
    );
};
