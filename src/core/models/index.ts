export class Goal {
    id: string;
    description: string;
    category: string;
    deadline: string;
    status: 'En Curso' | 'Completado' | 'Pausado';
    progress: number;

    constructor(
        id: string,
        description: string,
        category: string,
        deadline: string,
        status: 'En Curso' | 'Completado' | 'Pausado',
        progress: number = 0
    ) {
        this.id = id;
        this.description = description;
        this.category = category;
        this.deadline = deadline;
        this.status = status;
        this.progress = progress;
    }

    updateProgress(tasks: Task[]) {
        const goalTasks = tasks.filter(t => t.goalId === this.id);
        if (goalTasks.length === 0) {
            this.progress = 0;
            return;
        }
        const completed = goalTasks.filter(t => t.completed).length;
        this.progress = Math.round((completed / goalTasks.length) * 100);
        if (this.progress === 100) {
            this.status = 'Completado';
        } else {
            this.status = 'En Curso';
        }
    }
}

export class Task {
    id: string;
    goalId: string;
    description: string;
    deadline: string;
    completed: boolean;

    constructor(
        id: string,
        goalId: string,
        description: string,
        deadline: string,
        completed: boolean = false
    ) {
        this.id = id;
        this.goalId = goalId;
        this.description = description;
        this.deadline = deadline;
        this.completed = completed;
    }

    toggleComplete() {
        this.completed = !this.completed;
    }
}

export type HabitSchedule = {
    L: boolean; M: boolean; Mi: boolean; J: boolean; V: boolean; S: boolean; D: boolean;
};

export class Habit {
    id: string;
    name: string;
    schedule: HabitSchedule;

    constructor(
        id: string,
        name: string,
        schedule: HabitSchedule
    ) {
        this.id = id;
        this.name = name;
        this.schedule = schedule;
    }
}

export class HabitLog {
    date: string;
    habitId: string;
    executed: boolean;

    constructor(
        date: string,
        habitId: string,
        executed: boolean = false
    ) {
        this.date = date;
        this.habitId = habitId;
        this.executed = executed;
    }
}

export class TrackerData {
    goals: Goal[];
    tasks: Task[];
    habits: Habit[];
    habitLogs: HabitLog[];

    constructor(
        goals: Goal[] = [],
        tasks: Task[] = [],
        habits: Habit[] = [],
        habitLogs: HabitLog[] = []
    ) {
        this.goals = goals;
        this.tasks = tasks;
        this.habits = habits;
        this.habitLogs = habitLogs;
    }
}
