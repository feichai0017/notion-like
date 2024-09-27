'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

type Todo = {
    id: number;
    text: string;
    completed: boolean;
}

export default function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([
        { id: 1, text: 'Complete project proposal', completed: false },
        { id: 2, text: 'Schedule team meeting', completed: true },
        { id: 3, text: 'Prepare presentation slides', completed: false },
    ])
    const [newTodo, setNewTodo] = useState('')

    const addTodo = () => {
        if (newTodo.trim()) {
            setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
            setNewTodo('')
        }
    }

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ))
    }

    return (
        <div className="space-y-4">
            <div className="flex space-x-2">
                <Input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new todo"
                />
                <Button onClick={addTodo}>Add</Button>
            </div>
            <ul className="space-y-2">
                {todos.map((todo) => (
                    <li key={todo.id} className="flex items-center space-x-2">
                        <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                        />
                        <span className={todo.completed ? 'line-through' : ''}>{todo.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}