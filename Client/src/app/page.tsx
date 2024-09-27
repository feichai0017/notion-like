import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FileText, CheckSquare, Settings } from 'lucide-react'

export default function Home() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="space-y-6 max-w-4xl w-full p-6">
                <h1 className="text-3xl font-bold text-center mb-8">Welcome to Your Workspace</h1>
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
            </div>
        </div>
    )
}