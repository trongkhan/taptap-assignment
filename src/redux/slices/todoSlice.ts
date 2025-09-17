import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoModel } from "../../models/todoModel";

const initialState = {
    todos: [] as TodoModel[],
};
const TodoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<TodoModel>) => {
            state.todos.push(action.payload);
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.todos.find(t => t.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        deleteTodo: (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter(t => t.id !== action.payload);
        },
        editTodo: (state, action: PayloadAction<TodoModel>) => {
            const index = state.todos.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.todos[index] = action.payload;
            }
        },
    },
});

export default TodoSlice;
export const { addTodo, deleteTodo, toggleTodo, editTodo } = TodoSlice.actions;