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
        <div className="space-y-12 animate-fade-in">
            <header>
                <h2 className="text-3xl font-bold tracking-widest uppercase">Gestión de Metas</h2>
                <p className="text-cde-text-muted mt-2">Crea metas y desglósalas en tareas concretas.</p>
            </header>

            <section>
                <form onSubmit={handleAddGoal} className="flex gap-4 mb-8">
                    <input 
                        type="text" 
                        value={newGoalDesc}
                        onChange={e => setNewGoalDesc(e.target.value)}
                        placeholder="Nueva meta..." 
                        className="bg-cde-bg-light border border-cde-border px-4 py-2 rounded focus:outline-none focus:border-cde-text flex-1"
                        required
                    />
                    <select 
                        value={newGoalCat}
                        onChange={e => setNewGoalCat(e.target.value)}
                        className="bg-cde-bg-light border border-cde-border px-4 py-2 rounded focus:outline-none focus:border-cde-text"
                    >
                        <option>General</option>
                        <option>Académico</option>
                        <option>Personal</option>
                        <option>Financiero</option>
                    </select>
                    <button type="submit" className="border border-cde-text px-6 py-2 rounded hover:bg-cde-text hover:text-cde-bg transition-colors flex items-center gap-2">
                        <PlusCircle size={16} /> Añadir Meta
                    </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data.goals.length === 0 && <p className="text-cde-text-muted text-sm italic col-span-full">No hay metas registradas.</p>}
                    {data.goals.map(goal => (
                        <div key={goal.id} className="bg-cde-bg-light p-6 border border-cde-border rounded-lg relative group flex flex-col">
                            <button onClick={() => deleteGoal(goal.id)} className="absolute top-4 right-4 text-cde-border hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 size={16} />
                            </button>
                            <h3 className="text-lg font-bold pr-6 mb-1">{goal.description}</h3>
                            <span className="text-xs text-cde-text-muted uppercase tracking-wider mb-4">{goal.category} - {goal.status}</span>
                            
                            <div className="w-full bg-cde-bg-lighter h-2 rounded-full overflow-hidden mb-2">
                                <div 
                                    className="h-full bg-cde-text transition-all duration-500 ease-out"
                                    style={{ width: `${goal.progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-cde-text-muted mb-4">
                                <span>Progreso</span>
                                <span>{goal.progress}%</span>
                            </div>

                            {/* Goal Tasks inline */}
                            <div className="flex-1 mt-4 border-t border-cde-border pt-4">
                                <p className="text-xs uppercase tracking-widest text-cde-text-muted mb-3">Tareas asociadas</p>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {data.tasks.filter(t => t.goalId === goal.id).map(task => (
                                        <div key={task.id} className="flex items-start gap-2 group/task">
                                            <button onClick={() => toggleTask(task.id)} className="text-cde-text mt-0.5 hover:text-white transition-colors">
                                                {task.completed ? <CheckCircle size={14} /> : <Circle size={14} />}
                                            </button>
                                            <span className={`text-sm flex-1 leading-tight ${task.completed ? 'line-through text-cde-text-muted' : ''}`}>{task.description}</span>
                                            <button onClick={() => deleteTask(task.id)} className="text-cde-border hover:text-red-400 opacity-0 group-hover/task:opacity-100 transition-opacity">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-cde-bg-light border border-cde-border p-6 rounded-lg">
                <h3 className="text-lg tracking-widest uppercase mb-4">Añadir Tarea Masiva</h3>
                <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4">
                    <select 
                        value={selectedGoalId} 
                        onChange={e => setSelectedGoalId(e.target.value)}
                        className="bg-cde-bg-lighter border border-cde-border px-4 py-2 rounded focus:outline-none focus:border-cde-text"
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
                        className="bg-cde-bg-lighter border border-cde-border px-4 py-2 rounded focus:outline-none focus:border-cde-text flex-1"
                        required
                    />
                    <button type="submit" className="border border-cde-text px-6 py-2 rounded hover:bg-cde-text hover:text-cde-bg transition-colors flex items-center justify-center gap-2">
                        <PlusCircle size={16} /> Añadir
                    </button>
                </form>
            </section>
        </div>
    );
};
