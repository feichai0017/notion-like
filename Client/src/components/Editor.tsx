import React, { useRef, useEffect } from 'react'
import { useCompletion } from 'ai/react'

interface EditorProps {
    content: string;
    setContent: (content: string) => void;
    isAIMode: boolean;
    fontSize: number;
    fontFamily: string;
    textColor: string;
    backgroundColor: string;
    onSave: () => void;
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
    const { complete } = useCompletion({
        api: '/api/completion',
    })

    const handleInput = async () => {
        if (editorRef.current) {
            const newContent = editorRef.current.innerHTML
            setContent(newContent)

            if (isAIMode) {
                const lastWord = newContent.split(' ').pop() || ''
                if (lastWord.length > 2) {
                    const completion = await complete(lastWord)
                    if (completion) {
                        const selection = window.getSelection()
                        if (selection && selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0)
                            const node = document.createTextNode(completion)
                            range.insertNode(node)
                            range.setStartAfter(node)
                            range.setEndAfter(node)
                            selection.removeAllRanges()
                            selection.addRange(range)
                        }
                    }
                }
            }

            onSave()
        }
    }

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = content
        }
    }, [content])

    return (
        <div
            ref={editorRef}
            className="flex-grow p-4 overflow-auto outline-none"
            contentEditable
            onInput={handleInput}
            style={{ fontSize: `${fontSize}px`, fontFamily, color: textColor, backgroundColor }}
        />
    )
}