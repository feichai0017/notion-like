'use client'

import { useState } from 'react'
import { useCompletion } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AIAssistant() {
    const [query, setQuery] = useState('')
    const { complete, completion, isLoading } = useCompletion({
        api: '/api/completion',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        complete(query)
    }

    return (
        <div className="w-64 bg-gray-100 p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">AI Assistant</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about your notes..."
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Thinking...' : 'Ask AI'}
                </Button>
            </form>
            {completion && (
                <div className="mt-4 p-2 bg-white rounded">
                    <p>{completion}</p>
                </div>
            )}
        </div>
    )
}