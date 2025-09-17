import { priorityNames } from "../const/enum/priorityNames";

export interface TodoModel {
    id: string // UUID - auto generated;
    title: string;
    deadline: Date; // ISO date string
    priority: priorityNames.Low | priorityNames.Medium | priorityNames.High;
    completed: boolean;
}