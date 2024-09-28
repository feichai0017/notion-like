'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Folder, File, Download, Trash, PlusCircle, ChevronLeft, Search, FileText, Image, Code, Music, Video, Archive } from 'lucide-react'
import Link from 'next/link'
import { Progress } from "@/components/ui/progress"

type FileItem = {
    id: string;
    name: string;
    type: 'file' | 'folder';
    fileType?: 'document' | 'image' | 'code' | 'audio' | 'video' | 'archive';
    size?: number;
    lastModified?: Date;
    parentId: string | null;
}

const Logo = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="38" fill="#D5C3BB" />
        <path d="M24 40L34 50L56 28" stroke="#7D7168" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const getFileIcon = (type: string, fileType?: string) => {
    if (type === 'folder') return <Folder className="h-6 w-6" />
    switch (fileType) {
        case 'document': return <FileText className="h-6 w-6" />
        case 'image': return <Image className="h-6 w-6" />
        case 'code': return <Code className="h-6 w-6" />
        case 'audio': return <Music className="h-6 w-6" />
        case 'video': return <Video className="h-6 w-6" />
        case 'archive': return <Archive className="h-6 w-6" />
        default: return <File className="h-6 w-6" />
    }
}

export default function DocumentsPage() {
    const [items, setItems] = useState<FileItem[]>([
        { id: '1', name: 'Work', type: 'folder', parentId: null },
        { id: '2', name: 'Personal', type: 'folder', parentId: null },
        { id: '3', name: 'Project Proposal', type: 'file', fileType: 'document', size: 2500000, lastModified: new Date('2023-06-15'), parentId: '1' },
        { id: '4', name: 'Travel Photos', type: 'file', fileType: 'image', size: 15000000, lastModified: new Date('2023-05-20'), parentId: '2' },
        { id: '5', name: 'Meeting Notes', type: 'file', fileType: 'document', size: 500000, lastModified: new Date('2023-06-10'), parentId: '1' },
        { id: '6', name: 'Budget Spreadsheet', type: 'file', fileType: 'document', size: 1000000, lastModified: new Date('2023-06-05'), parentId: '1' },
        { id: '7', name: 'Recipes', type: 'folder', parentId: '2' },
        { id: '8', name: 'Pasta Carbonara', type: 'file', fileType: 'document', size: 300000, lastModified: new Date('2023-04-15'), parentId: '7' },
        { id: '9', name: 'Vacation Video', type: 'file', fileType: 'video', size: 500000000, lastModified: new Date('2023-05-25'), parentId: '2' },
        { id: '10', name: 'Project Source Code', type: 'file', fileType: 'code', size: 5000000, lastModified: new Date('2023-06-18'), parentId: '1' },
    ])
    const [currentFolder, setCurrentFolder] = useState<string | null>(null)
    const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false)
    const [newItemName, setNewItemName] = useState('')
    const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'name' | 'type' | 'size' | 'lastModified'>('name')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

    const controls = useAnimation()

    useEffect(() => {
        controls.start({ opacity: 1, y: 0 })
    }, [controls])

    const filteredItems = items
        .filter(item =>
            item.parentId === currentFolder &&
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
            } else if (sortBy === 'type') {
                return sortOrder === 'asc' ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)
            } else if (sortBy === 'size') {
                return sortOrder === 'asc' ? (a.size || 0) - (b.size || 0) : (b.size || 0) - (a.size || 0)
            } else if (sortBy === 'lastModified') {
                return sortOrder === 'asc'
                    ? (a.lastModified?.getTime() || 0) - (b.lastModified?.getTime() || 0)
                    : (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0)
            }
            return 0
        })

    const handleCreateNewItem = (e: React.FormEvent) => {
        e.preventDefault()
        const newItem: FileItem = {
            id: Date.now().toString(),
            name: newItemName,
            type: newItemType,
            fileType: newItemType === 'file' ? 'document' : undefined,
            size: newItemType === 'file' ? 0 : undefined,
            lastModified: new Date(),
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
        console.log(`Downloading ${name}`)
    }

    const getCurrentFolderName = () => {
        if (!currentFolder) return 'Root'
        const folder = items.find(item => item.id === currentFolder)
        return folder ? folder.name : 'Unknown Folder'
    }

    const formatFileSize = (size?: number) => {
        if (size === undefined) return 'N/A'
        const units = ['B', 'KB', 'MB', 'GB', 'TB']
        let unitIndex = 0
        let fileSize = size

        while (fileSize >= 1024 && unitIndex < units.length - 1) {
            fileSize /= 1024
            unitIndex++
        }

        return `${fileSize.toFixed(2)} ${units[unitIndex]}`
    }

    const getTotalSize = () => {
        return items.reduce((total, item) => total + (item.size || 0), 0)
    }

    const getUsedSpace = () => {
        const totalSize = getTotalSize()
        const maxSize = 10 * 1024 * 1024 * 1024 // 10 GB
        return (totalSize / maxSize) * 100
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E6E2DD] to-[#F0EBE8] p-12">
            <div className="max-w-8xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center space-x-6">
                        <Logo />
                        <h1 className="text-6xl font-bold text-[#7D7168]">Documents</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-80 bg-[#F0EBE8] border-[#D5C3BB] text-[#7D7168] placeholder-[#9C8E85] focus:ring-[#C8B5AD] focus:border-[#C8B5AD] text-lg"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9C8E85]" size={24} />
                        </div>
                        <Dialog open={isNewItemDialogOpen} onOpenChange={setIsNewItemDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD] transition-colors duration-300 text-lg px-6 py-3">
                                    <PlusCircle className="mr-2 h-6 w-6" /> New Item
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#F0EBE8] border-[#D5C3BB]">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-semibold text-[#7D7168]">Create New Item</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateNewItem} className="space-y-6">
                                    <Input
                                        placeholder="Item name"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        className="bg-[#E6E2DD] border-[#D5C3BB] text-[#7D7168] placeholder-[#9C8E85] focus:ring-[#C8B5AD] focus:border-[#C8B5AD] text-lg"
                                    />
                                    <div className="flex space-x-4">
                                        <Button
                                            type="button"
                                            variant={newItemType === 'file' ? 'default' : 'outline'}
                                            onClick={() => setNewItemType('file')}
                                            className={`flex-1 text-lg ${newItemType === 'file' ? "bg-[#D5C3BB] text-[#7D7168]" : "bg-[#E6E2DD] text-[#7D7168] border-[#D5C3BB]"} hover:bg-[#C8B5AD] transition-colors duration-300`}
                                        >
                                            File
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={newItemType === 'folder' ? 'default' : 'outline'}
                                            onClick={() => setNewItemType('folder')}
                                            className={`flex-1 text-lg ${newItemType === 'folder' ? "bg-[#D5C3BB] text-[#7D7168]" : "bg-[#E6E2DD] text-[#7D7168] border-[#D5C3BB]"} hover:bg-[#C8B5AD] transition-colors duration-300`}
                                        >
                                            Folder
                                        </Button>
                                    </div>
                                    <Button type="submit" className="w-full bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD] transition-colors duration-300 text-lg">Create</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={controls}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-[#F0EBE8] rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 bg-[#D5C3BB] text-[#7D7168] font-semibold text-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {currentFolder && (
                                <Button variant="ghost" onClick={() => setCurrentFolder(null)} className="text-[#7D7168] hover:bg-[#C8B5AD] transition-colors duration-300">
                                    <ChevronLeft className="mr-2 h-6 w-6" /> Back
                                </Button>
                            )}
                            <span>{getCurrentFolderName()}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-lg">Used Space: {formatFileSize(getTotalSize())} / 10 GB</span>
                            <Progress value={getUsedSpace()} className="w-48 bg-[#E6E2DD]" indicatorClassName="bg-[#7D7168]" />
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#E6E2DD]">
                                <TableHead className="text-[#7D7168] font-semibold text-lg cursor-pointer" onClick={() => {
                                    setSortBy('name')
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                                }}>Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}</TableHead>
                                <TableHead className="text-[#7D7168] font-semibold text-lg cursor-pointer" onClick={() => {
                                    setSortBy('type')
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                                }}>Type {sortBy === 'type' && (sortOrder === 'asc' ? '▲' : '▼')}</TableHead>
                                <TableHead className="text-[#7D7168] font-semibold text-lg cursor-pointer" onClick={() => {
                                    setSortBy('size')
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                                }}>Size {sortBy === 'size' && (sortOrder === 'asc' ? '▲' : '▼')}</TableHead>
                                <TableHead className="text-[#7D7168] font-semibold text-lg cursor-pointer" onClick={() => {
                                    setSortBy('lastModified')
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                                }}>Last Modified {sortBy === 'lastModified' && (sortOrder === 'asc' ? '▲' : '▼')}</TableHead>
                                <TableHead className="text-[#7D7168] font-semibold text-lg">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence>
                                {filteredItems.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5 }}
                                        className="hover:bg-[#E6E2DD] transition-colors duration-300"
                                    >
                                        <TableCell className="py-4">
                                            {item.type === 'folder' ? (
                                                <Button variant="ghost" onClick={() => setCurrentFolder(item.id)} className="text-[#7D7168] hover:text-[#9C8E85] transition-colors duration-300 text-lg">
                                                    {getFileIcon(item.type, item.fileType)}
                                                    <span className="ml-3">{item.name}</span>
                                                </Button>
                                            ) : (
                                                <Link href={`/documents/${item.id}`} className="flex items-center text-[#7D7168] hover:text-[#9C8E85] transition-colors duration-300 text-lg">
                                                    {getFileIcon(item.type, item.fileType)}
                                                    <span className="ml-3">{item.name}</span>
                                                </Link>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-[#9C8E85] capitalize text-lg">{item.type}</TableCell>
                                        <TableCell className="text-[#9C8E85] text-lg">{formatFileSize(item.size)}</TableCell>
                                        <TableCell className="text-[#9C8E85] text-lg">{item.lastModified?.toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                {item.type === 'file' && (
                                                    <Button variant="ghost" size="sm" onClick={() => handleDownload(item.name)} className="text-[#7D7168] hover:bg-[#E6E2DD] transition-colors duration-300">
                                                        <Download className="h-6 w-6" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-[#7D7168] hover:bg-[#E6E2DD] transition-colors duration-300">
                                                    <Trash className="h-6 w-6" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </motion.div>
            </div>
        </div>
    )
}