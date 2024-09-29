'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { AddTodoForm } from '@/components/AddTodoForm'
import { TodoList } from '@/components/TodoList'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Todo = {
    id: number;
    text: string;
    completed: boolean;
    date: Date;
    time: string;
    emailReminder: boolean;
}

const MorandiBackground = () => {
    return (
        <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-morandi-bg-light">
                <div className="absolute inset-0 bg-gradient-to-br from-morandi-accent via-morandi-bg-light to-morandi-bg-dark opacity-40" />
            </div>
            <div className="absolute inset-0">
                <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2U2ZTJkZCI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9IiNkNWMzYmIiIGZpbGwtb3BhY2l0eT0iMC40Ij48L2NpcmNsZT4KPC9zdmc+')] opacity-30" />
            </div>
        </div>
    )
}

export default function TodosPage() {
    const [todos, setTodos] = useState<Todo[]>([
        { id: 1, text: 'Complete project proposal', completed: false, date: new Date(), time: '14:00', emailReminder: false },
        { id: 2, text: 'Schedule team meeting', completed: true, date: new Date(Date.now() + 86400000), time: '10:00', emailReminder: true },
        { id: 3, text: 'Prepare presentation slides', completed: false, date: new Date(Date.now() + 172800000), time: '16:00', emailReminder: false },
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
                        console.log(`Reminder: ${todo.text}`)
                        if (todo.emailReminder) {
                            console.log(`Sending email reminder for: ${todo.text}`)
                            // Here you would implement the email sending logic
                        }
                    }
                }
            })
        }, 60000)

        return () => clearInterval(checkReminders)
    }, [todos])

    const addTodo = useCallback((text: string, date: Date, time: string, emailReminder: boolean) => {
        setTodos(prevTodos => [...prevTodos, {
            id: Date.now(),
            text,
            completed: false,
            date,
            time,
            emailReminder
        }])
    }, [])

    const toggleTodo = useCallback((id: number) => {
        setTodos(prevTodos => prevTodos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ))
    }, [])

    const toggleEmailReminder = useCallback((id: number) => {
        setTodos(prevTodos => prevTodos.map(todo =>
            todo.id === id ? { ...todo, emailReminder: !todo.emailReminder } : todo
        ))
    }, [])

    const filteredTodos = todos.filter(todo =>
        selectedDate && todo.date.toDateString() === selectedDate.toDateString()
    )

    return (
        <>
            <MorandiBackground />
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-7xl bg-morandi-bg-light rounded-lg shadow-lg overflow-hidden"
                >
                    <div className="p-8">
                        <h1 className="text-5xl font-bold mb-12 text-center text-morandi-text-primary">Reminders</h1>
                        <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
                            <Card className="lg:w-1/2 bg-morandi-bg-dark border-none shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-4xl text-morandi-text-primary text-center">Calendar</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        className="rounded-md border-none text-morandi-text-primary"
                                        classNames={{
                                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                            month: "space-y-4",
                                            caption: "flex justify-center pt-1 relative items-center text-2xl font-semibold",
                                            caption_label: "text-morandi-text-primary",
                                            nav: "space-x-1 flex items-center",
                                            nav_button: "h-10 w-10 bg-morandi-accent rounded-full flex items-center justify-center text-morandi-text-primary hover:bg-morandi-bg-light transition-colors",
                                            nav_button_previous: "absolute left-1",
                                            nav_button_next: "absolute right-1",
                                            table: "w-full border-collapse space-y-1",
                                            head_row: "flex",
                                            head_cell: "text-morandi-text-secondary rounded-md w-14 font-normal text-[0.875rem] m-0.5 text-center",
                                            row: "flex w-full mt-2",
                                            cell: "text-center text-lg p-0 relative [&:has([aria-selected])]:bg-morandi-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 m-0.5",
                                            day: "h-14 w-14 p-0 font-normal aria-selected:opacity-100 hover:bg-morandi-bg-light rounded-full transition-colors flex items-center justify-center",
                                            day_selected: "bg-morandi-accent text-morandi-text-primary hover:bg-morandi-bg-light hover:text-morandi-text-primary focus:bg-morandi-bg-light focus:text-morandi-text-primary rounded-full",
                                            day_today: "bg-morandi-bg-light text-morandi-text-primary rounded-full",
                                            day_outside: "text-morandi-text-secondary opacity-50",
                                            day_disabled: "text-morandi-text-secondary opacity-50",
                                            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                            day_hidden: "invisible",
                                        }}
                                        components={{
                                            IconLeft: ({ ...props }) => (
                                                <ChevronLeft className="h-6 w-6" />
                                            ),
                                            IconRight: ({ ...props }) => (
                                                <ChevronRight className="h-6 w-6" />
                                            ),
                                        }}
                                    />
                                </CardContent>
                            </Card>
                            <div className="lg:w-1/2 space-y-8">
                                <Card className="bg-morandi-bg-dark border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-3xl text-morandi-text-primary">Add New Reminder</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <AddTodoForm onAddTodo={addTodo} />
                                    </CardContent>
                                </Card>
                                <Card className="bg-morandi-bg-dark border-none shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-3xl text-morandi-text-primary">
                                            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <TodoList
                                            todos={filteredTodos}
                                            onToggleTodo={toggleTodo}
                                            onToggleEmailReminder={toggleEmailReminder}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    )
}