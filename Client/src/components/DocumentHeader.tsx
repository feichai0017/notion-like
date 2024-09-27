import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from 'lucide-react'

interface DocumentHeaderProps {
    title: string;
    setTitle: (title: string) => void;
    isAIMode: boolean;
    setIsAIMode: (isAIMode: boolean) => void;
    isAutoSave: boolean;
    setIsAutoSave: (isAutoSave: boolean) => void;
    isSaving: boolean;
    onSave: () => void;
}

export function DocumentHeader({
                                   title,
                                   setTitle,
                                   isAIMode,
                                   setIsAIMode,
                                   isAutoSave,
                                   setIsAutoSave,
                                   isSaving,
                                   onSave
                               }: DocumentHeaderProps) {
    const router = useRouter()

    const handleReturn = () => {
        router.push('/documents')
    }

    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={handleReturn}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold border-none focus:ring-0"
                />
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={isAIMode}
                        onCheckedChange={setIsAIMode}
                        id="ai-mode"
                    />
                    <label htmlFor="ai-mode" className="text-sm font-medium">
                        AI Mode {isAIMode ? 'On' : 'Off'}
                    </label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={isAutoSave}
                        onCheckedChange={setIsAutoSave}
                        id="auto-save"
                    />
                    <label htmlFor="auto-save" className="text-sm font-medium">
                        Auto Save
                    </label>
                </div>
                <Button variant="outline" onClick={onSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save'}
                    <Save className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}