'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FileText, CheckSquare, Settings, FileIcon, ImageIcon, CodeIcon } from 'lucide-react'

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const particles: { x: number; y: number; size: number; speedX: number; speedY: number }[] = []
        const particleCount = 100

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 5 + 1,
                speedX: Math.random() * 3 - 1.5,
                speedY: Math.random() * 3 - 1.5
            })
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach((particle) => {
                ctx.fillStyle = 'rgba(200, 200, 200, 0.5)'
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fill()

                particle.x += particle.speedX
                particle.y += particle.speedY

                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
            })

            requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}

const NoteTemplates = () => {
    const templates = [
        { icon: FileIcon, title: 'Blank Document', description: 'Start with a clean slate' },
        { icon: ImageIcon, title: 'Photo Journal', description: 'Document with image placeholders' },
        { icon: CodeIcon, title: 'Code Snippet', description: 'Pre-formatted for code blocks' },
    ]

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Note Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <template.icon className="mr-2 h-5 w-5" />
                                {template.title}
                            </CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">Use Template</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default function Home() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <ParticleBackground />
            <div className="space-y-6 max-w-6xl w-full p-6">
                <h1 className="text-4xl font-bold text-center mb-8">Welcome to Your Workspace</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Documents</CardTitle>
                            <CardDescription>Manage your documents and notes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="/documents">
                                    <FileText className="mr-2 h-4 w-4" /> Enter Documents
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Todos</CardTitle>
                            <CardDescription>Manage your tasks and reminders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="/todos">
                                    <CheckSquare className="mr-2 h-4 w-4" /> Enter Todos
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                            <CardDescription>Configure your workspace</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="/settings">
                                    <Settings className="mr-2 h-4 w-4" /> Open Settings
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <NoteTemplates />
            </div>
        </div>
    )
}