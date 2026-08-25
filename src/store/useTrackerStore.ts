import { create } from 'zustand';
import { TrackerData, Habit } from '../core/models';
import { TrackerManager } from '../core/services/TrackerManager';
import { LocalStorageService } from '../infrastructure/StorageService';

interface TrackerState {
    data: TrackerData;
    
    // Goals
    addGoal: (desc: string, category: string, deadline: string) => void;
    updateGoal: (id: string, desc: string, category: string) => void;
    deleteGoal: (id: string) => void;
    
    // Tasks
    addTask: (goalId: string, desc: string, deadline: string) => void;
    updateTask: (id: string, desc: string) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    
    // Habits
    addHabit: (name: string, schedule: Habit['schedule']) => void;
    updateHabit: (id: string, name: string, schedule: Habit['schedule']) => void;
    deleteHabit: (id: string) => void;
    toggleHabitLog: (habitId: string, date: Date) => void;
    
    // Utils
    exportData: () => string;
    importData: (json: string) => void;
}

const storage = new LocalStorageService();
const manager = new TrackerManager(storage);

export const useTrackerStore = create<TrackerState>((set) => ({
    data: manager.getData(),

    addGoal: (desc, category, deadline) => {
        manager.addGoal(desc, category, deadline);
        set({ data: { ...manager.getData() } });
    },
    updateGoal: (id, desc, category) => {
        manager.updateGoal(id, desc, category);
        set({ data: { ...manager.getData() } });
    },
    deleteGoal: (id) => {
        manager.deleteGoal(id);
        set({ data: { ...manager.getData() } });
    },

    addTask: (goalId, desc, deadline) => {
        manager.addTask(goalId, desc, deadline);
        set({ data: { ...manager.getData() } });
    },
    updateTask: (id, desc) => {
        manager.updateTask(id, desc);
        set({ data: { ...manager.getData() } });
    },
    toggleTask: (id) => {
        manager.toggleTask(id);
        set({ data: { ...manager.getData() } });
    },
    deleteTask: (id) => {
        manager.deleteTask(id);
        set({ data: { ...manager.getData() } });
    },

    addHabit: (name, schedule) => {
        manager.addHabit(name, schedule);
        set({ data: { ...manager.getData() } });
    },
    updateHabit: (id, name, schedule) => {
        manager.updateHabit(id, name, schedule);
        set({ data: { ...manager.getData() } });
    },
    deleteHabit: (id) => {
        manager.deleteHabit(id);
        set({ data: { ...manager.getData() } });
    },
    toggleHabitLog: (habitId, date) => {
        // format date as yyyy-mm-dd
        const dateStr = date.toISOString().split('T')[0];
        manager.toggleHabitLog(habitId, dateStr);
        set({ data: { ...manager.getData() } });
    },

    exportData: () => {
        return JSON.stringify(manager.getData(), null, 2);
    },
    importData: (json) => {
        const parsed = JSON.parse(json);
        manager.replaceData(parsed);
        set({ data: { ...manager.getData() } });
    }
}));
