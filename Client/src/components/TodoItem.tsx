import React from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'

interface TodoItemProps {
    id: number
    text: string
    completed: boolean
    time: string
    emailReminder: boolean
    onToggle: (id: number) => void
    onToggleEmailReminder: (id: number) => void
}

export function TodoItem({ id, text, completed, time, emailReminder, onToggle, onToggleEmailReminder }: TodoItemProps) {
    return (
        <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-4 p-4 rounded-md bg-[#F0EBE8] hover:bg-[#E6E2DD] transition-colors duration-200"
        >
            <Checkbox
                id={`todo-${id}`}
                checked={completed}
                onCheckedChange={() => onToggle(id)}
                className="h-6 w-6 border-[#9C8E85] text-[#7D7168]"
            />
            <Label
                htmlFor={`todo-${id}`}
                className={`flex-grow cursor-pointer text-lg text-[#7D7168] ${completed ? 'line-through opacity-50' : ''}`}
            >
                {text}
            </Label>
            <span className="text-base text-[#9C8E85]">{time}</span>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id={`email-reminder-${id}`}
                    checked={emailReminder}
                    onCheckedChange={() => onToggleEmailReminder(id)}
                    className="h-5 w-5 border-[#9C8E85] text-[#7D7168]"
                />
                <Label htmlFor={`email-reminder-${id}`} className="cursor-pointer">
                    <Mail className="h-5 w-5 text-[#9C8E85]" />
                </Label>
            </div>
        </motion.li>
    )
}