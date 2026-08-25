import { create } from 'zustand';
import { TrackerManager } from '../core/services/TrackerManager';
import { LocalStorageService } from '../infrastructure/StorageService';
import type { TrackerData, HabitSchedule } from '../core/models';

// Initialize the single instance of our POO manager
const storageService = new LocalStorageService();
const trackerManager = new TrackerManager(storageService);

interface TrackerState {
    data: TrackerData;
    // Actions
    addGoal: (description: string, category: string, deadline: string) => void;
    deleteGoal: (id: string) => void;
    addTask: (goalId: string, description: string, deadline: string) => void;
    toggleTask: (taskId: string) => void;
    deleteTask: (taskId: string) => void;
    addHabit: (name: string, schedule: HabitSchedule) => void;
    toggleHabitLog: (habitId: string, date: Date) => void;
    importData: (json: string) => void;
    exportData: () => string;
}

export const useTrackerStore = create<TrackerState>((set) => ({
    data: trackerManager.getData(),

    addGoal: (description, category, deadline) => {
        trackerManager.addGoal(description, category, deadline);
        set({ data: trackerManager.getData() });
    },
    deleteGoal: (id) => {
        trackerManager.deleteGoal(id);
        set({ data: trackerManager.getData() });
    },
    addTask: (goalId, description, deadline) => {
        trackerManager.addTask(goalId, description, deadline);
        set({ data: trackerManager.getData() });
    },
    toggleTask: (taskId) => {
        trackerManager.toggleTask(taskId);
        set({ data: trackerManager.getData() });
    },
    deleteTask: (taskId) => {
        trackerManager.deleteTask(taskId);
        set({ data: trackerManager.getData() });
    },
    addHabit: (name, schedule) => {
        trackerManager.addHabit(name, schedule);
        set({ data: trackerManager.getData() });
    },
    toggleHabitLog: (habitId, date) => {
        trackerManager.toggleHabitLog(habitId, date);
        set({ data: trackerManager.getData() });
    },
    importData: (json) => {
        trackerManager.importData(json);
        set({ data: trackerManager.getData() });
    },
    exportData: () => {
        return trackerManager.exportData();
    }
}));
