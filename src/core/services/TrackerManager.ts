import { TrackerData, Goal, Task, Habit, HabitLog } from '../models';
import type { IStorageService } from '../../infrastructure/StorageService';

export class TrackerManager {
    private data: TrackerData;
    private storage: IStorageService;

    constructor(storage: IStorageService) {
        this.storage = storage;
        this.data = this.storage.loadData();
    }

    public getData(): TrackerData {
        return this.data;
    }

    private saveData(): void {
        this.storage.saveData(this.data);
    }

    // --- Goals ---
    public addGoal(description: string, category: string, deadline: string): Goal {
        const goal = new Goal(`g_${Date.now()}`, description, category, deadline, 'En Curso', 0);
        this.data.goals.push(goal);
        this.saveData();
        return goal;
    }

    public updateGoal(id: string, newDescription: string, newCategory: string): void {
        const goal = this.data.goals.find(g => g.id === id);
        if (goal) {
            goal.description = newDescription;
            goal.category = newCategory;
            this.saveData();
        }
    }

    public deleteGoal(id: string): void {
        this.data.goals = this.data.goals.filter(g => g.id !== id);
        this.data.tasks = this.data.tasks.filter(t => t.goalId !== id); 
        this.saveData();
    }

    // --- Tasks ---
    public addTask(goalId: string, description: string, deadline: string): Task {
        const task = new Task(`t_${Date.now()}`, goalId, description, deadline);
        this.data.tasks.push(task);
        this.recalculateGoalProgress(goalId);
        this.saveData();
        return task;
    }

    public updateTask(id: string, newDescription: string): void {
        const task = this.data.tasks.find(t => t.id === id);
        if (task) {
            task.description = newDescription;
            this.saveData();
        }
    }

    public toggleTask(taskId: string): void {
        const task = this.data.tasks.find(t => t.id === taskId);
        if (task) {
            task.toggleComplete();
            this.recalculateGoalProgress(task.goalId);
            this.saveData();
        }
    }

    public deleteTask(taskId: string): void {
        const task = this.data.tasks.find(t => t.id === taskId);
        if (task) {
            this.data.tasks = this.data.tasks.filter(t => t.id !== taskId);
            this.recalculateGoalProgress(task.goalId);
            this.saveData();
        }
    }

    private recalculateGoalProgress(goalId: string): void {
        const goal = this.data.goals.find(g => g.id === goalId);
        if (!goal) return;

        const goalTasks = this.data.tasks.filter(t => t.goalId === goalId);
        if (goalTasks.length === 0) {
            goal.progress = 0;
            return;
        }

        const completed = goalTasks.filter(t => t.completed).length;
        goal.progress = Math.round((completed / goalTasks.length) * 100);
        
        if (goal.progress === 100) {
            goal.status = 'Completado';
        } else {
            goal.status = 'En Curso';
        }
    }

    // --- Habits ---
    public addHabit(name: string, schedule: Habit['schedule']): Habit {
        const habit = new Habit(`h_${Date.now()}`, name, schedule);
        this.data.habits.push(habit);
        this.saveData();
        return habit;
    }

    public updateHabit(id: string, newName: string, newSchedule: Habit['schedule']): void {
        const habit = this.data.habits.find(h => h.id === id);
        if (habit) {
            habit.name = newName;
            habit.schedule = newSchedule;
            this.saveData();
        }
    }

    public deleteHabit(id: string): void {
        this.data.habits = this.data.habits.filter(h => h.id !== id);
        this.data.habitLogs = this.data.habitLogs.filter(l => l.habitId !== id);
        this.saveData();
    }

    public toggleHabitLog(habitId: string, date: string): void {
        const existingLog = this.data.habitLogs.find(l => l.habitId === habitId && l.date === date);
        if (existingLog) {
            existingLog.executed = !existingLog.executed;
        } else {
            this.data.habitLogs.push(new HabitLog(habitId, date, true));
        }
        this.saveData();
    }

    public replaceData(newData: TrackerData): void {
        this.data = newData;
        this.saveData();
    }
}
