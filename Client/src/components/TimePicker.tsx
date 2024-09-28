import React, { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
    value: string
    onChange: (time: string) => void
}

export function TimePicker({ value, onChange }: TimePickerProps) {
    const [hours, setHours] = useState("00")
    const [minutes, setMinutes] = useState("00")

    useEffect(() => {
        if (value) {
            const [h, m] = value.split(':')
            setHours(h)
            setMinutes(m)
        }
    }, [value])

    const handleChange = (type: 'hours' | 'minutes', newValue: string) => {
        if (type === 'hours') {
            setHours(newValue)
        } else {
            setMinutes(newValue)
        }
        onChange(`${type === 'hours' ? newValue : hours}:${type === 'minutes' ? newValue : minutes}`)
    }

    return (
        <div className="flex space-x-2">
            <Select value={hours} onValueChange={(value) => handleChange('hours', value)}>
                <SelectTrigger className="w-[70px] bg-[#F0EBE8] border-[#D5C3BB] text-[#7D7168]">
                    <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((hour) => (
                        <SelectItem key={hour} value={hour}>
                            {hour}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <span className="text-[#7D7168] text-2xl">:</span>
            <Select value={minutes} onValueChange={(value) => handleChange('minutes', value)}>
                <SelectTrigger className="w-[70px] bg-[#F0EBE8] border-[#D5C3BB] text-[#7D7168]">
                    <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
                        <SelectItem key={minute} value={minute}>
                            {minute}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
