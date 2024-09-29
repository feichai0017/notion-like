'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FileText, CheckSquare, Settings, FileIcon, ImageIcon, CodeIcon } from 'lucide-react'

const MorandiBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
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

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach((particle) => {
                ctx.fillStyle = particle.color
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fill()

                // Calculate distance between particle and mouse
                const dx = mouseX - particle.x
                const dy = mouseY - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                // Move particles away from mouse
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
            canvas.removeEventListener('mousemove', () => {})
        }
    }, [])

    return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}

const Logo = () => (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="25" r="20" fill="#D5C3BB" />
        <path d="M15 25L22 32L35 19" stroke="#7D7168" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const NoteTemplates = () => {
    const templates = [
        { icon: FileIcon, title: 'Blank Document', description: 'Start with a clean slate' },
        { icon: ImageIcon, title: 'Photo Journal', description: 'Document with image placeholders' },
        { icon: CodeIcon, title: 'Code Snippet', description: 'Pre-formatted for code blocks' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12"
        >
            <h2 className="text-2xl font-bold mb-4 text-[#7D7168]">Note Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Card className="hover:shadow-lg transition-shadow bg-[#F0EBE8] border-[#D5C3BB]">
                            <CardHeader>
                                <CardTitle className="flex items-center text-[#7D7168]">
                                    <template.icon className="mr-2 h-5 w-5" />
                                    {template.title}
                                </CardTitle>
                                <CardDescription className="text-[#9C8E85]">{template.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD]">Use Template</Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

export default function Home() {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null)

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#E6E2DD]">
            <MorandiBackground />
            <div className="space-y-6 max-w-6xl w-full p-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center mb-8"
                >
                    <Logo />
                    <h1 className="text-4xl font-bold text-center ml-4 text-[#7D7168]">Welcome to Your Workspace</h1>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        { title: 'Documents', description: 'Manage your documents and notes', icon: FileText, href: '/documents' },
                        { title: 'Todos', description: 'Manage your tasks and reminders', icon: CheckSquare, href: '/todos' },
                        { title: 'Settings', description: 'Configure your workspace', icon: Settings, href: '/settings' },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onHoverStart={() => setHoveredCard(item.title)}
                            onHoverEnd={() => setHoveredCard(null)}
                        >
                            <Card className="hover:shadow-lg transition-shadow bg-[#F0EBE8] border-[#D5C3BB]">
                                <CardHeader>
                                    <CardTitle className="text-[#7D7168]">{item.title}</CardTitle>
                                    <CardDescription className="text-[#9C8E85]">{item.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button asChild className="w-full bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD]">
                                        <Link href={item.href}>
                                            <item.icon className="mr-2 h-4 w-4" />
                                            {hoveredCard === item.title ? `Enter ${item.title}` : `View ${item.title}`}
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
                <NoteTemplates />
            </div>
        </div>
    )
}