'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, PlusCircle, Search } from 'lucide-react'
import Link from 'next/link'

type Document = {
    id: string;
    title: string;
    updatedAt: Date;
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

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [isNewDocDialogOpen, setIsNewDocDialogOpen] = useState(false)
    const [newDocTitle, setNewDocTitle] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        // Simulating fetching documents from an API
        const fetchedDocs: Document[] = [
            { id: '1', title: 'Project A', updatedAt: new Date('2023-06-15') },
            { id: '2', title: 'Project B', updatedAt: new Date('2023-06-10') },
            { id: '3', title: 'Project C', updatedAt: new Date('2023-06-05') },
        ]
        setDocuments(fetchedDocs)
    }, [])

    const handleCreateNewDocument = (e: React.FormEvent) => {
        e.preventDefault()
        const newDoc: Document = {
            id: Date.now().toString(),
            title: newDocTitle,
            updatedAt: new Date(),
        }
        setDocuments([newDoc, ...documents])
        setIsNewDocDialogOpen(false)
        setNewDocTitle('')
    }

    const filteredDocuments = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#E6E2DD]">
            <MorandiBackground />
            <div className="p-8 max-w-4xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-[#7D7168]">Documents</h1>
                    <Dialog open={isNewDocDialogOpen} onOpenChange={setIsNewDocDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD]">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                New Document
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#F0EBE8]">
                            <DialogHeader>
                                <DialogTitle className="text-[#7D7168]">Create New Document</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateNewDocument} className="space-y-4">
                                <Input
                                    placeholder="Document title"
                                    value={newDocTitle}
                                    onChange={(e) => setNewDocTitle(e.target.value)}
                                    className="bg-[#E6E2DD] text-[#7D7168] placeholder-[#9C8E85]"
                                />
                                <Button type="submit" className="w-full bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD]">Create</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-[#E6E2DD] text-[#7D7168] placeholder-[#9C8E85]"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9C8E85]" size={20} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocuments.map((doc) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link href={`/documents/${doc.id}`} passHref>
                                <Button
                                    variant="outline"
                                    className="w-full h-auto text-left flex flex-col items-start p-4 hover:bg-[#D5C3BB] border-[#C8B5AD] bg-[#F0EBE8]"
                                >
                                    <div className="flex items-center w-full">
                                        <FileText className="w-5 h-5 mr-2 text-[#9C8E85]" />
                                        <span className="font-semibold text-[#7D7168]">{doc.title}</span>
                                    </div>
                                    <span className="text-sm text-[#9C8E85] mt-2">
                                        Updated {doc.updatedAt.toLocaleDateString()}
                                    </span>
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {filteredDocuments.length === 0 && (
                    <div className="text-center text-[#9C8E85] mt-8">
                        No documents found. Create a new one to get started!
                    </div>
                )}
            </div>
        </div>
    )
}