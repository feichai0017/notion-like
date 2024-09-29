import React from 'react'
import { Mountain } from 'lucide-react'

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Mountain className="h-8 w-8 text-morandi-accent" />
      <span className="text-xl font-bold text-morandi-text-primary">Notion-Like</span>
    </div>
  )
}