import { Goal, Task, Habit, HabitLog, TrackerData } from '../core/models';

export interface IStorageService {
    saveData(data: TrackerData): void;
    loadData(): TrackerData;
    exportData(): string;
    importData(jsonData: string): TrackerData;
}

export class LocalStorageService implements IStorageService {
    private readonly STORAGE_KEY = 'cdecasurpie_tracker_data';

    saveData(data: TrackerData): void {
        const serialized = JSON.stringify(data);
        localStorage.setItem(this.STORAGE_KEY, serialized);
    }

    loadData(): TrackerData {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (!raw) {
            return new TrackerData();
        }
        try {
            const parsed = JSON.parse(raw);
            return this.hydrate(parsed);
        } catch (error) {
            console.error('Error loading tracker data:', error);
            return new TrackerData();
        }
    }

    exportData(): string {
        return localStorage.getItem(this.STORAGE_KEY) || JSON.stringify(new TrackerData());
    }

    importData(jsonData: string): TrackerData {
        try {
            const parsed = JSON.parse(jsonData);
            const hydrated = this.hydrate(parsed);
            this.saveData(hydrated);
            return hydrated;
        } catch (error) {
            console.error('Error importing tracker data:', error);
            throw new Error("Formato de datos inválido.");
        }
    }

    private hydrate(parsed: any): TrackerData {
        const goals = (parsed.goals || []).map((g: any) => new Goal(g.id, g.description, g.category, g.deadline, g.status, g.progress));
        const tasks = (parsed.tasks || []).map((t: any) => new Task(t.id, t.goalId, t.description, t.deadline, t.completed));
        const habits = (parsed.habits || []).map((h: any) => new Habit(h.id, h.name, h.schedule));
        const habitLogs = (parsed.habitLogs || []).map((l: any) => new HabitLog(l.date, l.habitId, l.executed));
        
        return new TrackerData(goals, tasks, habits, habitLogs);
    }
}
