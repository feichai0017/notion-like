'use client'

import React, { useState, useEffect } from 'react'
import { DocumentHeader } from '@/components/DocumentHeader'
import { FormatToolbar } from '@/components/FormatToolbar'
import { Editor } from '@/components/Editor'

export default function DocumentPage({ params }: { params: { id: string } }) {
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('Untitled Document')
    const [isAIMode, setIsAIMode] = useState(false)
    const [fontSize, setFontSize] = useState(11)
    const [fontFamily, setFontFamily] = useState('Arial')
    const [textColor, setTextColor] = useState('#000000')
    const [backgroundColor, setBackgroundColor] = useState('#ffffff')
    const [isSaving, setIsSaving] = useState(false)
    const [isAutoSave, setIsAutoSave] = useState(true)

    const handleFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value)
    }

    const handleSave = async () => {
        setIsSaving(true)
        // Implement your save logic here
        // For example:
        // await saveDocument(params.id, { title, content })
        setTimeout(() => setIsSaving(false), 1000) // Simulating save operation
    }

    useEffect(() => {
        // Load document content when component mounts
        // For example:
        // const loadDocument = async () => {
        //   const doc = await fetchDocument(params.id)
        //   setTitle(doc.title)
        //   setContent(doc.content)
        // }
        // loadDocument()
    }, [params.id])

    return (
        <div className="flex flex-col h-screen">
            <DocumentHeader
                title={title}
                setTitle={setTitle}
                isAIMode={isAIMode}
                setIsAIMode={setIsAIMode}
                isAutoSave={isAutoSave}
                setIsAutoSave={setIsAutoSave}
                isSaving={isSaving}
                onSave={handleSave}
            />
            <FormatToolbar
                fontSize={fontSize}
                setFontSize={setFontSize}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
                textColor={textColor}
                setTextColor={setTextColor}
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                handleFormat={handleFormat}
            />
            <Editor
                content={content}
                setContent={setContent}
                isAIMode={isAIMode}
                fontSize={fontSize}
                fontFamily={fontFamily}
                textColor={textColor}
                backgroundColor={backgroundColor}
                onSave={isAutoSave ? handleSave : () => {}}
            />
        </div>
    )
}