'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DocumentHeader } from '@/components/DocumentHeader'
import { FormatToolbar } from '@/components/FormatToolbar'
import { Editor } from '@/components/Editor'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Save, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function DocumentPage({ params }: { params: { id: string } }) {
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('Untitled Document')
    const [isAIMode, setIsAIMode] = useState(false)
    const [fontSize, setFontSize] = useState(16)
    const [fontFamily, setFontFamily] = useState('Arial')
    const [textColor, setTextColor] = useState('#7D7168')
    const [backgroundColor, setBackgroundColor] = useState('#F0EBE8')
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
        <div className="flex flex-col h-screen bg-[#E6E2DD]">
            <DocumentHeader
                title={title}
                setTitle={setTitle}
                isAIMode={isAIMode}
                setIsAIMode={setIsAIMode}
                isAutoSave={isAutoSave}
                setIsAutoSave={setIsAutoSave}
                isSaving={isSaving}
                onSave={handleSave}
            >
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="text-[#7D7168] hover:bg-[#D5C3BB] hover:text-[#9C8E85] transition-colors duration-300"
                                >
                                    <Link href="/documents">
                                        <ChevronLeft className="h-5 w-5 mr-2" />
                                        Back
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Return to Documents</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </motion.div>
            </DocumentHeader>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
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
            </motion.div>
            <motion.div
                className="flex-grow overflow-auto p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
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
            </motion.div>
            <motion.div
                className="fixed bottom-8 right-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={handleSave}
                                className="bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD] transition-colors duration-300"
                            >
                                <Save className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Save Document</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </motion.div>
        </div>
    )
}