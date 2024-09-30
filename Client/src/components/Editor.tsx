'use client'

import React, { useCallback, useEffect, useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { StreamLanguage } from '@codemirror/language'
import { stex } from '@codemirror/legacy-modes/mode/stex'
import { EditorView } from '@codemirror/view'
import { linter, Diagnostic } from '@codemirror/lint'

interface EditorProps {
  content: string
  setContent: (content: string) => void
  isAIMode: boolean
  format: 'latex' | 'markdown' | 'mermaid'
  onSave: () => void
  isPreviewMode: boolean
}

export function Editor({
  content,
  setContent,
  isAIMode,
  format,
  onSave,
  isPreviewMode
}: EditorProps) {
  const handleChange = useCallback((value: string) => {
    setContent(value)
  }, [setContent])

  useEffect(() => {
    const saveInterval = setInterval(onSave, 30000) // Auto-save every 30 seconds
    return () => clearInterval(saveInterval)
  }, [onSave])

  const latexLinter = useMemo(() => linter((view) => {
    const diagnostics: Diagnostic[] = []
    const text = view.state.doc.toString()
    const lines = text.split('\n')

    lines.forEach((line, index) => {
      // Check for unbalanced braces
      const openBraces = (line.match(/\{/g) || []).length
      const closeBraces = (line.match(/\}/g) || []).length
      if (openBraces !== closeBraces) {
        diagnostics.push({
          from: view.state.doc.line(index + 1).from,
          to: view.state.doc.line(index + 1).to,
          severity: 'error',
          message: 'Unbalanced braces in this line'
        })
      }

      // Check for unbalanced dollar signs (inline math)
      const dollarSigns = (line.match(/\$/g) || []).length
      if (dollarSigns % 2 !== 0) {
        diagnostics.push({
          from: view.state.doc.line(index + 1).from,
          to: view.state.doc.line(index + 1).to,
          severity: 'error',
          message: 'Unbalanced dollar signs in this line'
        })
      }
    })

    return diagnostics
  }), [])

  const getLanguageExtension = useMemo(() => {
    if (format === 'latex') {
      return [StreamLanguage.define(stex), latexLinter]
    } else if (format === 'mermaid') {
      return [StreamLanguage.define({
        token(stream) {
          if (stream.match(/^graph/) || stream.match(/^sequenceDiagram/) || stream.match(/^classDiagram/)) return "keyword"
          if (stream.match(/\[.*?\]/)) return "string"
          if (stream.match(/$$.*?$$/)) return "string"
          if (stream.match(/-->/)) return "operator"
          if (stream.match(/==/)) return "operator"
          if (stream.match(/-/)) return "operator"
          if (stream.match(/:/)) return "operator"
          stream.next()
          return null
        }
      })]
    }
    return [markdown()]
  }, [format, latexLinter])

  const theme = useMemo(() => {
    return EditorView.theme({
      "&": {
        height: "100%",
        fontSize: "16px",
        backgroundColor: "#F0EBE8",
        color: "#7D7168"
      },
      ".cm-scroller": {
        overflow: "auto"
      },
      ".cm-content": {
        caretColor: "#9C8E85"
      },
      ".cm-cursor": {
        borderLeftColor: "#9C8E85"
      },
      "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "#D5C3BB"
      },
      ".cm-gutters": {
        backgroundColor: "#E6E2DD",
        color: "#9C8E85",
        border: "none"
      },
      ".cm-activeLineGutter": {
        backgroundColor: "#D5C3BB"
      },
      ".cm-line": {
        padding: "0 4px"
      },
      ".cm-errorDeco": {
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderLeft: "3px solid #FF0000"
      }
    }, { dark: false })
  }, [])

  return (
    <div className="h-full flex overflow-hidden rounded-lg shadow-inner bg-morandi-bg-light">
      <CodeMirror
        value={content}
        height="100%"
        extensions={getLanguageExtension}
        onChange={handleChange}
        theme={theme}
        className="h-full w-full"
      />
      {isAIMode && (
        <div className="fixed bottom-20 right-8 bg-morandi-accent text-morandi-text-primary p-4 rounded-lg shadow-lg">
          AI Mode is active. Start typing for suggestions...
        </div>
      )}
    </div>
  )
}