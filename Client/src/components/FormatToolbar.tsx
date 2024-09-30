import React from 'react'
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered, Image, Code, Type, Sigma, Table, GitBranch, GitMerge, GitPullRequest } from 'lucide-react'

interface FormatToolbarProps {
  format: 'markdown' | 'latex' | 'mermaid'
  onFormat: (type: string) => void
}

export function FormatToolbar({ format, onFormat }: FormatToolbarProps) {
  const markdownTools = [
    { icon: Bold, label: 'Bold', action: 'bold' },
    { icon: Italic, label: 'Italic', action: 'italic' },
    { icon: List, label: 'Unordered List', action: 'unordered-list' },
    { icon: ListOrdered, label: 'Ordered List', action: 'ordered-list' },
    { icon: Image, label: 'Image', action: 'image' },
    { icon: Code, label: 'Code Block', action: 'code-block' },
  ]

  const latexTools = [
    { icon: Type, label: 'Equation', action: 'equation' },
    { icon: Sigma, label: 'Symbol', action: 'symbol' },
    { icon: Table, label: 'Matrix', action: 'matrix' },
  ]

  const mermaidTools = [
    { icon: GitBranch, label: 'Flowchart', action: 'flowchart' },
    { icon: GitMerge, label: 'Sequence Diagram', action: 'sequence' },
    { icon: GitPullRequest, label: 'Class Diagram', action: 'class' },
  ]

  const tools = format === 'markdown' ? markdownTools : format === 'latex' ? latexTools : mermaidTools

  return (
    <div className="flex space-x-2 p-2 bg-morandi-bg-dark rounded-md">
      {tools.map((tool) => (
        <Button
          key={tool.label}
          variant="ghost"
          size="sm"
          onClick={() => onFormat(tool.action)}
          title={tool.label}
        >
          <tool.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  )
}