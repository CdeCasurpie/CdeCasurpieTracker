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
        <div className="space-y-10 animate-fade-in max-w-7xl mx-auto">
            <header className="animate-slide-up" style={{ animationDelay: '0ms' }}>
                <h2 className="text-3xl font-bold tracking-widest uppercase">Resumen Diario</h2>
                <p className="text-cde-text-muted mt-2">{format(today, 'dd/MM/yyyy')} - Mantén el enfoque.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Immediate Tasks */}
                <section className="bg-cde-bg-light border border-cde-border p-8 rounded-xl animate-slide-up shadow-sm hover:shadow-md transition-shadow" style={{ animationDelay: '100ms' }}>
                    <h3 className="text-xl tracking-widest uppercase border-b border-cde-border pb-4 mb-6">Tareas de Hoy</h3>
                    
                    <form onSubmit={handleAddImmediateTask} className="mb-8 flex flex-col gap-4">
                        <select 
                            value={selectedGoalId} 
                            onChange={e => setSelectedGoalId(e.target.value)}
                            className="bg-cde-bg-lighter border border-cde-border px-4 py-3 rounded-lg focus:outline-none focus:border-cde-text focus:ring-1 focus:ring-cde-text w-full text-sm transition-all"
                            required
                        >
                            <option value="">-- Vincular a Meta --</option>
                            {data.goals.map(g => <option key={g.id} value={g.id}>{g.description}</option>)}
                        </select>
                        <div className="flex gap-3">
                            <input 
                                type="text" 
                                value={newTaskDesc}
                                onChange={e => setNewTaskDesc(e.target.value)}
                                placeholder="Añadir tarea rápida..." 
                                className="bg-cde-bg-lighter border border-cde-border px-4 py-3 rounded-lg focus:outline-none focus:border-cde-text focus:ring-1 focus:ring-cde-text flex-1 text-sm transition-all"
                                required
                            />
                            <button type="submit" className="border border-cde-text bg-cde-bg-lighter px-4 py-3 rounded-lg hover:bg-cde-text hover:text-cde-bg transition-colors flex items-center justify-center active:scale-95">
                                <PlusCircle size={20} />
                            </button>
                        </div>
                    </form>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {pendingTasks.length === 0 && <p className="text-sm italic text-cde-text-muted">¡Todo al día!</p>}
                        {pendingTasks.map((task, idx) => (
                            <div key={task.id} className="flex items-center gap-4 p-4 bg-cde-bg-lighter border border-cde-border rounded-lg hover:border-cde-text hover:bg-cde-bg/50 transition-all animate-slide-up group" style={{ animationDelay: `${150 + idx * 50}ms` }}>
                                <button onClick={() => toggleTask(task.id)} className="text-cde-text opacity-70 hover:opacity-100 hover:scale-110 active:scale-90 transition-all">
                                    <Circle size={22} />
                                </button>
                                <span className="flex-1 text-sm group-hover:text-white transition-colors">{task.description}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Daily Habits */}
                <section className="bg-cde-bg-light border border-cde-border p-8 rounded-xl animate-slide-up shadow-sm hover:shadow-md transition-shadow" style={{ animationDelay: '200ms' }}>
                    <h3 className="text-xl tracking-widest uppercase border-b border-cde-border pb-4 mb-6">Hábitos del Día</h3>
                    
                    <div className="space-y-4">
                        {(() => {
                            const dayMapping = { 0: 'D', 1: 'L', 2: 'M', 3: 'Mi', 4: 'J', 5: 'V', 6: 'S' } as const;
                            const currentDayKey = dayMapping[today.getDay() as keyof typeof dayMapping];
                            
                            const habitsForToday = data.habits.filter(h => h.schedule[currentDayKey as keyof typeof h.schedule]);

                            if (habitsForToday.length === 0) {
                                return <p className="text-sm italic text-cde-text-muted">No hay hábitos programados para hoy.</p>;
                            }

                            return habitsForToday.map((habit, idx) => {
                                const isExecuted = getHabitLogForToday(habit.id)?.executed || false;
                                return (
                                    <div key={habit.id} className={`flex items-center justify-between p-5 bg-cde-bg-lighter border border-cde-border rounded-lg transition-all animate-slide-up hover:border-cde-text ${isExecuted ? 'opacity-50' : 'hover:scale-[1.02]'}`} style={{ animationDelay: `${250 + idx * 50}ms` }}>
                                        <span className={`font-medium ${isExecuted ? 'text-cde-text-muted line-through' : ''}`}>{habit.name}</span>
                                        <button 
                                            onClick={() => toggleHabitLog(habit.id, today)} 
                                            className={`transition-all active:scale-90 ${isExecuted ? 'text-cde-text' : 'text-cde-text-muted hover:text-white hover:scale-110'}`}
                                        >
                                            {isExecuted ? <CheckSquare size={26} /> : <Square size={26} />}
                                        </button>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </section>
            </div>
            
            {/* Quick KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-cde-bg-light border border-cde-border p-6 rounded-xl text-center animate-slide-up hover:-translate-y-1 transition-transform" style={{ animationDelay: '300ms' }}>
                    <p className="text-cde-text-muted text-xs tracking-widest uppercase mb-2">Metas Activas</p>
                    <p className="text-3xl font-bold">{data.goals.filter(g => g.status === 'En Curso').length}</p>
                </div>
                <div className="bg-cde-bg-light border border-cde-border p-6 rounded-xl text-center animate-slide-up hover:-translate-y-1 transition-transform" style={{ animationDelay: '400ms' }}>
                    <p className="text-cde-text-muted text-xs tracking-widest uppercase mb-2">Tareas Completadas</p>
                    <p className="text-3xl font-bold">{completedTasksCount}</p>
                </div>
                <div className="bg-cde-bg-light border border-cde-border p-6 rounded-xl text-center animate-slide-up hover:-translate-y-1 transition-transform" style={{ animationDelay: '500ms' }}>
                    <p className="text-cde-text-muted text-xs tracking-widest uppercase mb-2">Hábitos Hoy</p>
                    {(() => {
                        const dayMapping = { 0: 'D', 1: 'L', 2: 'M', 3: 'Mi', 4: 'J', 5: 'V', 6: 'S' } as const;
                        const currentDayKey = dayMapping[today.getDay() as keyof typeof dayMapping];
                        const habitsForToday = data.habits.filter(h => h.schedule[currentDayKey as keyof typeof h.schedule]);
                        const completed = habitsForToday.filter(h => getHabitLogForToday(h.id)?.executed).length;
                        return <p className="text-3xl font-bold">{completed} / {habitsForToday.length}</p>;
                    })()}
                </div>
            </div>
        </div>
    );
};
