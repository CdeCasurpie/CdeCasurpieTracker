import React, { useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import { PlusCircle, CheckCircle, Circle, Trash2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { data, addTask, toggleTask, addGoal, deleteTask } = useTrackerStore();
    const [newGoalDesc, setNewGoalDesc] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [selectedGoalId, setSelectedGoalId] = useState('');

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
