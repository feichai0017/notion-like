import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, Clock } from "lucide-react"

interface AddTodoFormProps {
    onAddTodo: (text: string, date: Date, time: string) => void
}

export function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
    const [newTodo, setNewTodo] = useState('')
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState('12:00')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (newTodo.trim() && selectedDate) {
            onAddTodo(newTodo, selectedDate, selectedTime)
            setNewTodo('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new reminder"
                className="w-full"
            />
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full sm:w-[240px] justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full sm:w-[120px]"
                    />
                </div>
                <Button type="submit" className="w-full sm:w-auto">Add</Button>
            </div>
        </form>
    )
}