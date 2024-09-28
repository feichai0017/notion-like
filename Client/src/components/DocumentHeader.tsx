import React from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface DocumentHeaderProps {
    title: string
    setTitle: (title: string) => void
    isAIMode: boolean
    setIsAIMode: (isAIMode: boolean) => void
    isAutoSave: boolean
    setIsAutoSave: (isAutoSave: boolean) => void
    isSaving: boolean
    onSave: () => void
    children?: React.ReactNode
}

export function DocumentHeader({
                                   title,
                                   setTitle,
                                   isAIMode,
                                   setIsAIMode,
                                   isAutoSave,
                                   setIsAutoSave,
                                   isSaving,
                                   onSave,
                                   children
                               }: DocumentHeaderProps) {
    return (
        <motion.div
            className="flex items-center justify-between p-4 bg-[#D5C3BB] text-[#7D7168]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center space-x-4">
                {children}
                <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-[#7D7168] placeholder-[#9C8E85]"
                    placeholder="Untitled Document"
                />
            </div>
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="ai-mode" className="text-sm font-medium">AI Mode</Label>
                    <Switch
                        id="ai-mode"
                        checked={isAIMode}
                        onCheckedChange={setIsAIMode}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="auto-save" className="text-sm font-medium">Auto Save</Label>
                    <Switch
                        id="auto-save"
                        checked={isAutoSave}
                        onCheckedChange={setIsAutoSave}
                    />
                </div>
                <span className="text-sm">
                    {isSaving ? 'Saving...' : 'Saved'}
                </span>
            </div>
        </motion.div>
    )
}