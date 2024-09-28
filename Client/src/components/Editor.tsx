import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface EditorProps {
    content: string
    setContent: (content: string) => void
    isAIMode: boolean
    fontSize: number
    fontFamily: string
    textColor: string
    backgroundColor: string
    onSave: () => void
}

export function Editor({
                           content,
                           setContent,
                           isAIMode,
                           fontSize,
                           fontFamily,
                           textColor,
                           backgroundColor,
                           onSave
                       }: EditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [isComposing, setIsComposing] = useState(false)

    useEffect(() => {
        const saveInterval = setInterval(onSave, 30000) // Auto-save every 30 seconds
        return () => clearInterval(saveInterval)
    }, [onSave])

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = content
        }
    }, [content])

    const handleInput = () => {
        if (editorRef.current && !isComposing) {
            setContent(editorRef.current.innerHTML)
        }
    }

    const handleCompositionStart = () => {
        setIsComposing(true)
    }

    const handleCompositionEnd = () => {
        setIsComposing(false)
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML)
        }
    }

    const handleFocus = () => {
        if (editorRef.current) {
            // Move cursor to the end of the content
            const range = document.createRange()
            const selection = window.getSelection()
            range.selectNodeContents(editorRef.current)
            range.collapse(false)
            selection?.removeAllRanges()
            selection?.addRange(range)
        }
    }

    return (
        <motion.div
            className="flex-grow overflow-auto p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onFocus={handleFocus}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                className="min-h-full outline-none"
                style={{
                    fontSize: `${fontSize}px`,
                    fontFamily,
                    color: textColor,
                    backgroundColor,
                }}
            />
            {isAIMode && (
                <div className="fixed bottom-20 right-8 bg-[#D5C3BB] text-[#7D7168] p-4 rounded-lg shadow-lg">
                    AI Mode is active. Start typing for suggestions...
                </div>
            )}
        </motion.div>
    )
}