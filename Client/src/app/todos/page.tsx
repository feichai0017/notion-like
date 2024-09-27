'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

type Todo = {
    id: number;
    text: string;
    completed: boolean;
}

export default function TodosPage() {
    const [todos, setTodos] = useState<Todo[]>([
        { id: 1, text: 'Complete project proposal', completed: false },
        { id: 2, text: 'Schedule team meeting', completed: true },
        { id: 3, text: 'Prepare presentation slides', completed: false },
    ])
    const [newTodo, setNewTodo] = useState('')

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault()
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
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Todos</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Add New Todo</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={addTodo} className="flex space-x-2">
                        <Input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            placeholder="Add a new todo"
                            className="flex-grow"
                        />
                        <Button type="submit">Add</Button>
                    </form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Your Todos</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {todos.map((todo) => (
                            <li key={todo.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`todo-${todo.id}`}
                                    checked={todo.completed}
                                    onCheckedChange={() => toggleTodo(todo.id)}
                                />
                                <Label
                                    htmlFor={`todo-${todo.id}`}
                                    className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}
                                >
                                    {todo.text}
                                </Label>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}