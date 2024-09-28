import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from 'lucide-react'

interface FormatToolbarProps {
    fontSize: number
    setFontSize: (size: number) => void
    fontFamily: string
    setFontFamily: (family: string) => void
    textColor: string
    setTextColor: (color: string) => void
    backgroundColor: string
    setBackgroundColor: (color: string) => void
    handleFormat: (command: string, value?: string) => void
}

export function FormatToolbar({
                                  fontSize,
                                  setFontSize,
                                  fontFamily,
                                  setFontFamily,
                                  textColor,
                                  setTextColor,
                                  backgroundColor,
                                  setBackgroundColor,
                                  handleFormat
                              }: FormatToolbarProps) {
    const formatButtons = [
        { icon: <Bold className="h-4 w-4" />, command: 'bold', tooltip: 'Bold' },
        { icon: <Italic className="h-4 w-4" />, command: 'italic', tooltip: 'Italic' },
        { icon: <Underline className="h-4 w-4" />, command: 'underline', tooltip: 'Underline' },
        { icon: <AlignLeft className="h-4 w-4" />, command: 'justifyLeft', tooltip: 'Align Left' },
        { icon: <AlignCenter className="h-4 w-4" />, command: 'justifyCenter', tooltip: 'Align Center' },
        { icon: <AlignRight className="h-4 w-4" />, command: 'justifyRight', tooltip: 'Align Right' },
        { icon: <List className="h-4 w-4" />, command: 'insertUnorderedList', tooltip: 'Bullet List' },
        { icon: <ListOrdered className="h-4 w-4" />, command: 'insertOrderedList', tooltip: 'Numbered List' },
    ]

    return (
        <motion.div
            className="flex items-center space-x-2 p-2 bg-[#F0EBE8] border-b border-[#D5C3BB]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Font Family" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Courier">Courier</SelectItem>
                </SelectContent>
            </Select>
            <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(Number(value))}>
                <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                    {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72].map((size) => (
                        <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-8 h-8 rounded-full overflow-hidden"
            />
            <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-8 h-8 rounded-full overflow-hidden"
            />
            <TooltipProvider>
                {formatButtons.map((button, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleFormat(button.command)}
                                className="text-[#7D7168] hover:bg-[#E6E2DD] hover:text-[#9C8E85] transition-colors duration-300"
                            >
                                {button.icon}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{button.tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>
        </motion.div>
    )
}