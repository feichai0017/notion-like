'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { 
  Home, 
  FileText, 
  Folder, 
  CheckSquare, 
  Settings, 
  ChevronRight, 
  ChevronDown,
  Mountain
} from 'lucide-react'
import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"
import type { Engine } from "tsparticles-engine"

type Document = {
  id: string;
  title: string;
  subPageCount: number;
}

export function Sidebar() {
  const pathname = usePathname()
  const [documents, setDocuments] = useState<Document[]>([])
  const [expandedDocuments, setExpandedDocuments] = useState<string[]>([])

  useEffect(() => {
    const fetchDocuments = async () => {
      // Simulating API call
      const mockDocuments: Document[] = [
        { id: '1', title: 'Document A', subPageCount: 3 },
        { id: '2', title: 'Document B', subPageCount: 2 },
        { id: '3', title: 'Document C', subPageCount: 5 },
      ]
      setDocuments(mockDocuments)
    }

    fetchDocuments()
  }, [])

  const toggleDocumentExpansion = (documentId: string) => {
    setExpandedDocuments(prev => 
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    )
  }

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <div className="w-64 h-screen bg-morandi-bg-dark text-morandi-text-primary p-4 flex flex-col relative overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.2,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 pointer-events-none"
      />
      
      <div className="mb-6 relative z-10">
        <div className="flex items-center space-x-2">
          <Mountain className="h-8 w-8 text-morandi-accent" />
          <span className="text-xl font-bold text-morandi-text-primary">Notion-Like</span>
        </div>
      </div>

      <nav className="flex-grow relative z-10">
        <ul className="space-y-2">
          <li>
            <Link href="/" passHref>
              <Button
                variant="ghost"
                className={`w-full justify-start ${pathname === '/' ? 'bg-morandi-hover' : ''}`}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/documents" passHref>
              <Button
                variant="ghost"
                className={`w-full justify-start ${pathname === '/documents' ? 'bg-morandi-hover' : ''}`}
              >
                <Folder className="mr-2 h-4 w-4" />
                Documents
              </Button>
            </Link>
          </li>
          {documents.map((document) => (
            <li key={document.id}>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => toggleDocumentExpansion(document.id)}
              >
                {expandedDocuments.includes(document.id) ? (
                  <ChevronDown className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronRight className="mr-2 h-4 w-4" />
                )}
                {document.title}
                <span className="ml-auto text-morandi-text-secondary">{document.subPageCount}</span>
              </Button>
              {expandedDocuments.includes(document.id) && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-4 mt-2 space-y-2"
                >
                  {[...Array(document.subPageCount)].map((_, index) => (
                    <li key={index}>
                      <Link href={`/documents/${document.id}/pages/${index + 1}`} passHref>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm"
                        >
                          <FileText className="mr-2 h-3 w-3" />
                          Page {index + 1}
                        </Button>
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </li>
          ))}
          <li>
            <Link href="/todos" passHref>
              <Button
                variant="ghost"
                className={`w-full justify-start ${pathname === '/todos' ? 'bg-morandi-hover' : ''}`}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Todos
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/settings" passHref>
              <Button
                variant="ghost"
                className={`w-full justify-start ${pathname === '/settings' ? 'bg-morandi-hover' : ''}`}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}