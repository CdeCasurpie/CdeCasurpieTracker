import { Goal, Task, Habit, HabitLog, TrackerData } from '../models';
import type { IStorageService } from '../../infrastructure/StorageService';
import { format } from 'date-fns';

export class TrackerManager {
    private data: TrackerData;
    private storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this.storageService = storageService;
        this.data = this.storageService.loadData();
    }

    // --- Data Access ---
    getData(): TrackerData {
        return this.data;
    }

    private saveData() {
        this.storageService.saveData(this.data);
    }

    exportData(): string {
        return this.storageService.exportData();
    }

    importData(json: string): void {
        this.data = this.storageService.importData(json);
    }

    // --- Goals ---
    addGoal(description: string, category: string, deadline: string): Goal {
        const goal = new Goal(`g_${Date.now()}`, description, category, deadline, 'En Curso', 0);
        this.data.goals.push(goal);
        this.saveData();
        return goal;
    }

    updateGoal(id: string, updates: Partial<Goal>): void {
        const goal = this.data.goals.find(g => g.id === id);
        if (goal) {
            Object.assign(goal, updates);
            this.saveData();
        }
    }

    deleteGoal(id: string): void {
        this.data.goals = this.data.goals.filter(g => g.id !== id);
        this.data.tasks = this.data.tasks.filter(t => t.goalId !== id); // Cascade delete tasks
        this.saveData();
    }

    // --- Tasks ---
    addTask(goalId: string, description: string, deadline: string): Task {
        const task = new Task(`t_${Date.now()}`, goalId, description, deadline);
        this.data.tasks.push(task);
        this.recalculateGoalProgress(goalId);
        this.saveData();
        return task;
    }

    toggleTask(taskId: string): void {
        const task = this.data.tasks.find(t => t.id === taskId);
        if (task) {
            task.toggleComplete();
            this.recalculateGoalProgress(task.goalId);
            this.saveData();
        }
    }

    deleteTask(taskId: string): void {
        const task = this.data.tasks.find(t => t.id === taskId);
        if (task) {
            this.data.tasks = this.data.tasks.filter(t => t.id !== taskId);
            this.recalculateGoalProgress(task.goalId);
            this.saveData();
        }
    }

    private recalculateGoalProgress(goalId: string): void {
        if (!goalId) return;
        const goal = this.data.goals.find(g => g.id === goalId);
        if (goal) {
            goal.updateProgress(this.data.tasks);
        }
    }

    // --- Habits ---
    addHabit(name: string, schedule: Habit['schedule']): Habit {
        const habit = new Habit(`h_${Date.now()}`, name, schedule);
        this.data.habits.push(habit);
        this.saveData();
        return habit;
    }

    toggleHabitLog(habitId: string, date: Date): void {
        const dateStr = format(date, 'yyyy-MM-dd');
        const existingLog = this.data.habitLogs.find(l => l.habitId === habitId && l.date === dateStr);
        
        if (existingLog) {
            existingLog.executed = !existingLog.executed;
        } else {
            this.data.habitLogs.push(new HabitLog(dateStr, habitId, true));
        }
        this.saveData();
    }
}
