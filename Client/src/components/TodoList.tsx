import React from 'react'
import { TodoItem } from './TodoItem'
import { motion, AnimatePresence } from 'framer-motion'

interface Todo {
    id: number
    text: string
    completed: boolean
    date: Date
    time: string
    emailReminder: boolean
}

interface TodoListProps {
    todos: Todo[]
    onToggleTodo: (id: number) => void
    onToggleEmailReminder: (id: number) => void
}

export function TodoList({ todos, onToggleTodo, onToggleEmailReminder }: TodoListProps) {
    return (
        <ul className="space-y-4">
            <AnimatePresence>
                {todos.length === 0 ? (
                    <motion.li
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center text-[#9C8E85] text-lg"
                    >
                        No reminders for this day
                    </motion.li>
                ) : (
                    todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            id={todo.id}
                            text={todo.text}
                            completed={todo.completed}
                            time={todo.time}
                            emailReminder={todo.emailReminder}
                            onToggle={onToggleTodo}
                            onToggleEmailReminder={onToggleEmailReminder}
                        />
                    ))
                )}
            </AnimatePresence>
        </ul>
    )
}