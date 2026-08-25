import React, { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { PlusCircle, CheckCircle, Circle, Trash2 } from 'lucide-react';

export const GoalsView: React.FC = () => {
    const { data, addGoal, deleteGoal, addTask, toggleTask, deleteTask } = useTrackerStore();
    const [newGoalDesc, setNewGoalDesc] = useState('');
    const [newGoalCat, setNewGoalCat] = useState('General');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [selectedGoalId, setSelectedGoalId] = useState('');

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalDesc.trim()) {
            addGoal(newGoalDesc, newGoalCat, new Date().toISOString());
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

    return (
        <div className="space-y-12 animate-fade-in max-w-7xl mx-auto">
            <header className="animate-slide-up" style={{ animationDelay: '0ms' }}>
                <h2 className="text-3xl font-bold tracking-widest uppercase">Gestión de Metas</h2>
                <p className="text-cde-text-muted mt-2">Crea metas y desglósalas en tareas concretas.</p>
            </header>

            <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <form onSubmit={handleAddGoal} className="flex flex-col md:flex-row gap-4 mb-8">
                    <input 
                        type="text" 
                        value={newGoalDesc}
                        onChange={e => setNewGoalDesc(e.target.value)}
                        placeholder="Nueva meta..." 
                        className="bg-cde-bg-light border border-cde-border px-5 py-3 rounded-lg focus:outline-none focus:border-cde-text focus:ring-1 focus:ring-cde-text flex-1 transition-all"
                        required
                    />
                    <select 
                        value={newGoalCat}
                        onChange={e => setNewGoalCat(e.target.value)}
                        className="bg-cde-bg-light border border-cde-border px-5 py-3 rounded-lg focus:outline-none focus:border-cde-text focus:ring-1 focus:ring-cde-text transition-all"
                    >
                        <option>General</option>
                        <option>Académico</option>
                        <option>Personal</option>
                        <option>Financiero</option>
                    </select>
                    <button type="submit" className="border border-cde-text bg-cde-bg-light px-8 py-3 rounded-lg hover:bg-cde-text hover:text-cde-bg transition-all active:scale-95 flex items-center justify-center gap-2 font-medium">
                        <PlusCircle size={18} /> Añadir Meta
                    </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {data.goals.length === 0 && <p className="text-cde-text-muted text-sm italic col-span-full">No hay metas registradas.</p>}
                    {data.goals.map((goal, idx) => (
                        <div key={goal.id} className="bg-cde-bg-light p-8 border border-cde-border rounded-xl relative group flex flex-col shadow-sm hover:shadow-md hover:border-cde-text transition-all animate-slide-up" style={{ animationDelay: `${200 + idx * 50}ms` }}>
                            <button onClick={() => deleteGoal(goal.id)} className="absolute top-6 right-6 text-cde-border hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90">
                                <Trash2 size={18} />
                            </button>
                            <h3 className="text-xl font-bold pr-8 mb-2 group-hover:text-cde-text transition-colors">{goal.description}</h3>
                            <span className="text-xs text-cde-text-muted uppercase tracking-widest mb-6 block">{goal.category} - {goal.status}</span>
                            
                            <div className="w-full bg-cde-bg-lighter h-2.5 rounded-full overflow-hidden mb-3">
                                <div 
                                    className="h-full bg-cde-text transition-all duration-700 ease-out"
                                    style={{ width: `${goal.progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-cde-text-muted mb-6 font-bold">
                                <span>Progreso</span>
                                <span>{goal.progress}%</span>
                            </div>

                            {/* Goal Tasks inline */}
                            <div className="flex-1 mt-auto border-t border-cde-border pt-6">
                                <p className="text-[10px] uppercase tracking-widest text-cde-text-muted mb-4 font-bold">Tareas asociadas</p>
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {data.tasks.filter(t => t.goalId === goal.id).map(task => (
                                        <div key={task.id} className="flex items-start gap-3 group/task hover:bg-cde-bg-lighter p-2 rounded transition-colors -ml-2">
                                            <button onClick={() => toggleTask(task.id)} className="text-cde-text mt-0.5 opacity-70 hover:opacity-100 hover:scale-110 active:scale-90 transition-all">
                                                {task.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                                            </button>
                                            <span className={`text-sm flex-1 leading-tight transition-colors ${task.completed ? 'line-through text-cde-text-muted' : 'group-hover/task:text-white'}`}>{task.description}</span>
                                            <button onClick={() => deleteTask(task.id)} className="text-cde-border hover:text-red-400 opacity-0 group-hover/task:opacity-100 transition-all hover:scale-110">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-cde-bg-light border border-cde-border p-8 rounded-xl animate-slide-up shadow-sm" style={{ animationDelay: '300ms' }}>
                <h3 className="text-xl tracking-widest uppercase mb-6 border-b border-cde-border pb-4">Añadir Tarea Rápida</h3>
                <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4">
                    <select 
                        value={selectedGoalId} 
                        onChange={e => setSelectedGoalId(e.target.value)}
                        className="bg-cde-bg-lighter border border-cde-border px-5 py-3 rounded-lg focus:outline-none focus:border-cde-text focus:ring-1 focus:ring-cde-text transition-all"
                        required
                    >
                        <option value="">-- Seleccionar Meta --</option>
                        {data.goals.map(g => <option key={g.id} value={g.id}>{g.description}</option>)}
                    </select>
                    <input 
                        type="text" 
                        value={newTaskDesc}
                        onChange={e => setNewTaskDesc(e.target.value)}
                        placeholder="Descripción de la tarea..." 
                        className="bg-cde-bg-lighter border border-cde-border px-5 py-3 rounded-lg focus:outline-none focus:border-cde-text focus:ring-1 focus:ring-cde-text flex-1 transition-all"
                        required
                    />
                    <button type="submit" className="border border-cde-text bg-cde-bg-lighter px-8 py-3 rounded-lg hover:bg-cde-text hover:text-cde-bg transition-all active:scale-95 flex items-center justify-center gap-2 font-medium">
                        <PlusCircle size={18} /> Añadir
                    </button>
                </form>
            </section>
        </div>
    );
};
