import React from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface TodoItemProps {
    id: number
    text: string
    completed: boolean
    time: string
    onToggle: (id: number) => void
}

export function TodoItem({ id, text, completed, time, onToggle }: TodoItemProps) {
    return (
        <li className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
            <Checkbox
                id={`todo-${id}`}
                checked={completed}
                onCheckedChange={() => onToggle(id)}
                className="h-5 w-5"
            />
            <Label
                htmlFor={`todo-${id}`}
                className={`flex-grow cursor-pointer ${completed ? 'line-through text-muted-foreground' : ''}`}
            >
                {text}
            </Label>
            <span className="text-sm text-muted-foreground">{time}</span>
        </li>
    )
}