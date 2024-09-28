import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { TimePicker } from './TimePicker'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface AddTodoFormProps {
    onAddTodo: (text: string, date: Date, time: string, emailReminder: boolean) => void
}

export function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
    const [text, setText] = useState('')
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [time, setTime] = useState('12:00')
    const [emailReminder, setEmailReminder] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (text && date && time) {
            onAddTodo(text, date, time, emailReminder)
            setText('')
            setDate(undefined)
            setTime('12:00')
            setEmailReminder(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="todo-text" className="text-[#7D7168] text-lg">Reminder</Label>
                <Input
                    id="todo-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your reminder"
                    className="mt-1 bg-[#F0EBE8] border-[#D5C3BB] text-[#7D7168] placeholder-[#9C8E85] text-lg"
                />
            </div>
            <div>
                <Label htmlFor="todo-date" className="text-[#7D7168] text-lg">Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal bg-[#F0EBE8] border-[#D5C3BB] text-[#7D7168] ${!date && "text-muted-foreground"}`}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div>
                <Label htmlFor="todo-time" className="text-[#7D7168] text-lg">Time</Label>
                <TimePicker value={time} onChange={setTime} />
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="email-reminder"
                    checked={emailReminder}
                    onCheckedChange={(checked) => setEmailReminder(checked as boolean)}
                    className="h-5 w-5 border-[#9C8E85] text-[#7D7168]"
                />
                <Label htmlFor="email-reminder" className="text-[#7D7168] text-lg cursor-pointer">
                    Send email reminder
                </Label>
            </div>
            <Button type="submit" className="w-full bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD] text-lg py-6">
                Add Reminder
            </Button>
        </form>
    )
}