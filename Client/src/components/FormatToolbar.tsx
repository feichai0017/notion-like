import React from 'react'
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered, Image, Code, Type, Sigma, Table, GitBranch, GitMerge, GitPullRequest } from 'lucide-react'

interface FormatToolbarProps {
  format: 'markdown' | 'latex' | 'mermaid' | 'typst'
  onFormat: (type: string, value?: string) => void
  content: string
  setContent: (content: string) => void
}

export function FormatToolbar({ format, onFormat, content, setContent }: FormatToolbarProps) {
  const wrapText = (before: string, after: string) => {
    const textarea = document.querySelector('textarea')
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = content.substring(start, end)
      const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)
      setContent(newText)
      onFormat('update', newText)
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, end + before.length)
      }, 0)
    }
  }

  const insertText = (text: string) => {
    const textarea = document.querySelector('textarea')
    if (textarea) {
      const start = textarea.selectionStart
      const newText = content.substring(0, start) + text + content.substring(start)
      setContent(newText)
      onFormat('update', newText)
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + text.length, start + text.length)
      }, 0)
    }
  }

  const markdownTools = [
    { icon: Bold, label: 'Bold', action: () => wrapText('**', '**') },
    { icon: Italic, label: 'Italic', action: () => wrapText('*', '*') },
    { icon: List, label: 'Unordered List', action: () => insertText('\n- ') },
    { icon: ListOrdered, label: 'Ordered List', action: () => insertText('\n1. ') },
    { icon: Image, label: 'Image', action: () => insertText('![Alt text](https://example.com/image.jpg)') },
    { icon: Code, label: 'Code Block', action: () => wrapText('\n```\n', '\n```\n') },
  ]

  const latexTools = [
    { icon: Type, label: 'Equation', action: () => wrapText('\\begin{equation}\n', '\n\\end{equation}') },
    { icon: Sigma, label: 'Symbol', action: () => insertText('\\sum_{i=1}^{n}') },
    { icon: Table, label: 'Matrix', action: () => insertText('\\begin{matrix}\na & b \\\\\nc & d\n\\end{matrix}') },
  ]

  const mermaidTools = [
    { icon: GitBranch, label: 'Flowchart', action: () => insertText('graph TD;\nA-->B;\nB-->C;\nC-->D;\nD-->A;') },
    { icon: GitMerge, label: 'Sequence Diagram', action: () => insertText('sequenceDiagram\nAlice->>John: Hello John, how are you?\nJohn-->>Alice: Great!\nAlice-)John: See you later!') },
    { icon: GitPullRequest, label: 'Class Diagram', action: () => insertText('classDiagram\nClass01 <|-- AveryLongClass : Cool\nClass03 *-- Class04\nClass05 o-- Class06\nClass07 .. Class08\nClass09 --> C2 : Where am i?\nClass09 --* C3\nClass09 --|> Class07\nClass07 : equals()\nClass07 : Object[] elementData\nClass01 : size()\nClass01 : int chimp\nClass01 : int gorilla\nClass08 <--> C2: Cool label') },
  ]

  const typstTools = [
    { icon: Type, label: 'Heading', action: () => insertText('= Heading\n') },
    { icon: Sigma, label: 'Math', action: () => wrapText('$', '$') },
    { icon: Table, label: 'Table', action: () => insertText('```typst\n#table(\n  columns: (auto, auto),\n  [*Name*], [*Value*],\n  [A], [1],\n  [B], [2],\n)\n```\n') },
    { icon: Image, label: 'Figure', action: () => insertText('#figure(\n  image("image.jpg", width: 80%),\n  caption: [A sample image],\n)\n') },
  ]

  const tools = format === 'markdown' ? markdownTools
      : format === 'latex' ? latexTools
          : format === 'mermaid' ? mermaidTools
              : typstTools

  return (
      <div className="flex space-x-2 p-2 bg-morandi-bg-dark rounded-md">
        {tools.map((tool) => (
            <Button
                key={tool.label}
                variant="ghost"
                size="sm"
                onClick={tool.action}
                title={tool.label}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
        ))}
      </div>
  )
}