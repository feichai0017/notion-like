'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Folder, File, Download, Trash, PlusCircle } from 'lucide-react'
import Link from 'next/link'

type FileItem = {
    id: string;
    name: string;
    type: 'file' | 'folder';
    parentId: string | null;
}

export default function DocumentsPage() {
    const [items, setItems] = useState<FileItem[]>([
        { id: '1', name: 'Work', type: 'folder', parentId: null },
        { id: '2', name: 'Personal', type: 'folder', parentId: null },
        { id: '3', name: 'Project Proposal', type: 'file', parentId: '1' },
        { id: '4', name: 'Travel Plans', type: 'file', parentId: '2' },
    ])
    const [currentFolder, setCurrentFolder] = useState<string | null>(null)
    const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false)
    const [newItemName, setNewItemName] = useState('')
    const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file')

    const currentItems = items.filter(item => item.parentId === currentFolder)

    const handleCreateNewItem = (e: React.FormEvent) => {
        e.preventDefault()
        const newItem: FileItem = {
            id: Date.now().toString(),
            name: newItemName,
            type: newItemType,
            parentId: currentFolder,
        }
        setItems([...items, newItem])
        setIsNewItemDialogOpen(false)
        setNewItemName('')
    }

    const handleDelete = (id: string) => {
        setItems(items.filter(item => item.id !== id))
    }

    const handleDownload = (name: string) => {
        // Implement actual download logic here
        console.log(`Downloading ${name}`)
    }

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Documents</h1>
                <Dialog open={isNewItemDialogOpen} onOpenChange={setIsNewItemDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> New Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Item</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateNewItem} className="space-y-4">
                            <Input
                                placeholder="Item name"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                            />
                            <div className="flex space-x-2">
                                <Button
                                    type="button"
                                    variant={newItemType === 'file' ? 'default' : 'outline'}
                                    onClick={() => setNewItemType('file')}
                                >
                                    File
                                </Button>
                                <Button
                                    type="button"
                                    variant={newItemType === 'folder' ? 'default' : 'outline'}
                                    onClick={() => setNewItemType('folder')}
                                >
                                    Folder
                                </Button>
                            </div>
                            <Button type="submit" className="w-full">Create</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentFolder && (
                        <TableRow>
                            <TableCell colSpan={3}>
                                <Button variant="ghost" onClick={() => setCurrentFolder(null)}>
                                    ..
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                    {currentItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                {item.type === 'folder' ? (
                                    <Button variant="ghost" onClick={() => setCurrentFolder(item.id)}>
                                        <Folder className="mr-2 h-4 w-4" /> {item.name}
                                    </Button>
                                ) : (
                                    <Link href={`/documents/${item.id}`} className="flex items-center">
                                        <File className="mr-2 h-4 w-4" /> {item.name}
                                    </Link>
                                )}
                            </TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>
                                {item.type === 'file' && (
                                    <Button variant="ghost" size="sm" onClick={() => handleDownload(item.name)}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}