'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle, FileText, Edit2, Trash2, ChevronLeft, Download } from 'lucide-react'
import Link from 'next/link'

type SubPage = {
    id: string;
    title: string;
    updatedAt: Date;
    content: string;
}

type Document = {
    id: string;
    title: string;
    description: string;
    subPages: SubPage[];
}

const MorandiBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const animate = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const particles: { x: number; y: number; size: number; speedX: number; speedY: number; color: string }[] = []
        const particleCount = 50
        const colors = ['#D5C3BB', '#E6E2DD', '#9C8E85', '#7D7168', '#C8B5AD']

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 4 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                color: colors[Math.floor(Math.random() * colors.length)]
            })
        }

        let mouseX = 0
        let mouseY = 0

        canvas.addEventListener('mousemove', (e) => {
            mouseX = e.clientX
            mouseY = e.clientY
        })

        const animationLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach((particle) => {
                ctx.fillStyle = particle.color
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fill()

                const dx = mouseX - particle.x
                const dy = mouseY - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < 100) {
                    const angle = Math.atan2(dy, dx)
                    particle.x -= Math.cos(angle) * 1
                    particle.y -= Math.sin(angle) * 1
                }

                particle.x += particle.speedX
                particle.y += particle.speedY

                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
            })

            requestAnimationFrame(animationLoop)
        }

        animationLoop()

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            canvas.removeEventListener('mousemove', () => {})
        }
    }, [])

    useEffect(() => {
        animate()
    }, [animate])

    return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}

export default function DocumentDetailsPage() {
    const { id } = useParams()
    const router = useRouter()
    const [document, setDocument] = useState<Document | null>(null)
    const [isNewPageDialogOpen, setIsNewPageDialogOpen] = useState(false)
    const [newPageTitle, setNewPageTitle] = useState('')
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [editedTitle, setEditedTitle] = useState('')
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [editedDescription, setEditedDescription] = useState('')

    useEffect(() => {
        const fetchDocument = async () => {
            // Simulating API call
            const mockDocument: Document = {
                id: id as string,
                title: 'Project A',
                description: 'This is Project A description.',
                subPages: [
                    { id: '1-1', title: 'Requirements', updatedAt: new Date('2023-06-14'), content: 'Requirements content...' },
                    { id: '1-2', title: 'Design', updatedAt: new Date('2023-06-13'), content: 'Design content...' },
                ]
            }
            setDocument(mockDocument)
            setEditedTitle(mockDocument.title)
            setEditedDescription(mockDocument.description)
        }

        fetchDocument()
    }, [id])

    const handleCreateNewPage = (e: React.FormEvent) => {
        e.preventDefault()
        if (document && newPageTitle.trim()) {
            const newPage: SubPage = {
                id: Date.now().toString(),
                title: newPageTitle.trim(),
                updatedAt: new Date(),
                content: '',
            }
            setDocument({
                ...document,
                subPages: [...document.subPages, newPage]
            })
            setIsNewPageDialogOpen(false)
            setNewPageTitle('')
        }
    }

    const handleTitleEdit = () => {
        if (document && editedTitle.trim() !== document.title) {
            setDocument({
                ...document,
                title: editedTitle.trim()
            })
        }
        setIsEditingTitle(false)
    }

    const handleDescriptionEdit = () => {
        if (document && editedDescription.trim() !== document.description) {
            setDocument({
                ...document,
                description: editedDescription.trim()
            })
        }
        setIsEditingDescription(false)
    }

    const handleDeletePage = (pageId: string) => {
        if (document) {
            setDocument({
                ...document,
                subPages: document.subPages.filter(page => page.id !== pageId)
            })
        }
    }

    const handleDownloadPage = (page: SubPage) => {
        const blob = new Blob([page.content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${page.title}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    if (!document) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#E6E2DD]">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#7D7168]"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#E6E2DD]">
            <MorandiBackground />
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-8 max-w-6xl mx-auto relative z-10"
            >
                <Button
                    variant="ghost"
                    className="absolute top-4 left-4 text-[#7D7168] hover:bg-[#D5C3BB]"
                    onClick={() => router.push('/documents')}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Documents
                </Button>

                <div className="mb-8 mt-16">
                    {isEditingTitle ? (
                        <div className="flex items-center">
                            <Input
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="text-4xl font-bold bg-transparent border-none focus:ring-0 text-[#7D7168]"
                                onBlur={handleTitleEdit}
                                onKeyPress={(e) => e.key === 'Enter' && handleTitleEdit()}
                                autoFocus
                            />
                        </div>
                    ) : (
                        <h1 
                            className="text-4xl font-bold text-[#7D7168] cursor-pointer hover:bg-[#D5C3BB] inline-block px-2 py-1 rounded"
                            onClick={() => setIsEditingTitle(true)}
                        >
                            {document.title}
                            <Edit2 className="inline-block ml-2 w-6 h-6 text-[#9C8E85]" />
                        </h1>
                    )}
                    {isEditingDescription ? (
                        <Textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="mt-2 bg-transparent border-none focus:ring-0 text-[#9C8E85]"
                            onBlur={handleDescriptionEdit}
                            autoFocus
                        />
                    ) : (
                        <p 
                            className="text-[#9C8E85] mt-2 cursor-pointer hover:bg-[#D5C3BB] inline-block px-2 py-1 rounded"
                            onClick={() => setIsEditingDescription(true)}
                        >
                            {document.description}
                            <Edit2 className="inline-block ml-2 w-4 h-4 text-[#9C8E85]" />
                        </p>
                    )}
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-[#7D7168]">Pages</h2>
                    <Dialog open={isNewPageDialogOpen} onOpenChange={setIsNewPageDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD] transition-colors duration-200">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                New Page
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#F0EBE8]">
                            <DialogHeader>
                                <DialogTitle className="text-[#7D7168]">Create New Page</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateNewPage} className="space-y-4">
                                <Input
                                    placeholder="Page title"
                                    value={newPageTitle}
                                    onChange={(e) => setNewPageTitle(e.target.value)}
                                    className="bg-[#E6E2DD] text-[#7D7168] placeholder-[#9C8E85]"
                                />
                                <Button type="submit" className="w-full bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD] transition-colors duration-200">Create</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                    <AnimatePresence>
                        {document.subPages.map((page) => (
                            <motion.div
                                key={page.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative group">
                                    <Link href={`/documents/${id}/pages/${page.id}`} passHref>
                                        <Button
                                            variant="outline"
                                            className="w-full h-auto text-left flex flex-col items-start p-4 hover:bg-[#D5C3BB] border-[#C8B5AD] bg-[#F0EBE8] transition-colors duration-200"
                                        >
                                            <div className="flex items-center w-full">
                                                <FileText className="w-5 h-5 mr-2 text-[#9C8E85]" />
                                                <span className="font-semibold text-[#7D7168]">{page.title}</span>
                                            </div>
                                            <span className="text-sm text-[#9C8E85] mt-2">
                                                Updated {page.updatedAt.toLocaleDateString()}
                                            </span>
                                        </Button>
                                    </Link>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex">
                                        <Button
                                            variant="ghost"
                                            className="mr-2"
                                            onClick={() => handleDownloadPage(page)}
                                        >
                                            <Download className="w-4 h-4 text-[#9C8E85] hover:text-[#7D7168]" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleDeletePage(page.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-[#9C8E85] hover:text-[#7D7168]" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {document.subPages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-[#9C8E85] mt-8 p-8 bg-[#F0EBE8] rounded-lg"
                    >
                        <FileText className="w-16 h-16 mx-auto mb-4 text-[#9C8E85]" />
                        <p className="text-xl font-semibold mb-2">No pages found</p>
                        <p>Create a new page to get started!</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}