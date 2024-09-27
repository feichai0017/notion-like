'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Share2 } from 'lucide-react'

const documents = [
    { id: 1, title: 'Project Proposal', updatedAt: '2023-09-28' },
    { id: 2, title: 'Meeting Notes', updatedAt: '2023-09-27' },
    { id: 3, title: 'Budget Plan', updatedAt: '2023-09-26' },
]

export default function DocumentList() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {documents.map((doc) => (
                    <TableRow key={doc.id}>
                        <TableCell>
                            <Link href={`/documents/${doc.id}`} className="text-blue-600 hover:underline">
                                {doc.title}
                            </Link>
                        </TableCell>
                        <TableCell>{doc.updatedAt}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="sm" className="mr-2">
                                <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}