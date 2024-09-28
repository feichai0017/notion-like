import React from 'react'
import { TodoItem } from './TodoItem'

interface Todo {
    id: number
    text: string
    completed: boolean
    date: Date
    time: string
}

interface TodoListProps {
    todos: Todo[]
    onToggleTodo: (id: number) => void
}

export function TodoList({ todos, onToggleTodo }: TodoListProps) {
    return (
        <ul className="space-y-4">
            {todos.length === 0 ? (
                <li className="text-center text-muted-foreground">No reminders for this day</li>
            ) : (
                todos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        id={todo.id}
                        text={todo.text}
                        completed={todo.completed}
                        time={todo.time}
                        onToggle={onToggleTodo}
                    />
                ))
            )}
        </ul>
    )
}