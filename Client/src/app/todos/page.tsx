'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { AddTodoForm } from '@/components/AddTodoForm'
import { TodoList } from '@/components/TodoList'

type Todo = {
    id: number;
    text: string;
    completed: boolean;
    date: Date;
    time: string;
}

export default function TodosPage() {
    const [todos, setTodos] = useState<Todo[]>([
        { id: 1, text: 'Complete project proposal', completed: false, date: new Date(), time: '14:00' },
        { id: 2, text: 'Schedule team meeting', completed: true, date: new Date(Date.now() + 86400000), time: '10:00' },
        { id: 3, text: 'Prepare presentation slides', completed: false, date: new Date(Date.now() + 172800000), time: '16:00' },
    ])
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

    useEffect(() => {
        const checkReminders = setInterval(() => {
            const now = new Date()
            todos.forEach(todo => {
                if (!todo.completed) {
                    const todoDateTime = new Date(todo.date)
                    todoDateTime.setHours(parseInt(todo.time.split(':')[0]), parseInt(todo.time.split(':')[1]))
                    if (todoDateTime <= now) {
                        // In a real app, you'd show a notification here
                        console.log(`Reminder: ${todo.text}`)
                    }
                }
            })
        }, 60000) // Check every minute

        return () => clearInterval(checkReminders)
    }, [todos])

    const addTodo = (text: string, date: Date, time: string) => {
        setTodos([...todos, {
            id: Date.now(),
            text,
            completed: false,
            date,
            time
        }])
    }

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ))
    }

    const filteredTodos = todos.filter(todo =>
        selectedDate && todo.date.toDateString() === selectedDate.toDateString()
    )

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-4xl font-bold mb-8 text-center">Reminders</h1>
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                <Card className="md:w-2/5 lg:w-1/3">
                    <CardHeader>
                        <CardTitle className="text-2xl">Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border p-4"
                            classNames={{
                                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                day_today: "bg-accent text-accent-foreground",
                                day: "h-10 w-10 text-center leading-10 rounded-full hover:bg-accent hover:text-accent-foreground",
                                head_cell: "text-muted-foreground font-normal text-sm",
                                nav_button: "border rounded-md p-1 hover:bg-accent hover:text-accent-foreground",
                                table: "w-full border-collapse space-y-1",
                            }}
                        />
                    </CardContent>
                </Card>
                <div className="md:w-3/5 lg:w-2/3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Add New Reminder</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AddTodoForm onAddTodo={addTodo} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TodoList todos={filteredTodos} onToggleTodo={toggleTodo} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}