'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/app/api/completion/route'
import { DocumentHeader } from '@/components/DocumentHeader'
import { Editor } from '@/components/Editor'
import { FormatToolbar } from '@/components/FormatToolbar'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Play, Edit2, Eye, Download, ExternalLink } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import * as pdfjsLib from 'pdfjs-dist'

// Ensure the worker is correctly set
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

type SubPage = {
  id: string
  title: string
  content: string
}

type Format = 'latex' | 'markdown'

export default function SubPageEditingPage() {
  const { id, pageId } = useParams()
  const router = useRouter()
  const [subPage, setSubPage] = useState<SubPage | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [format, setFormat] = useState<Format>('markdown')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isAIMode, setIsAIMode] = useState(false)
  const [isAutoSave, setIsAutoSave] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null)
  const [latexError, setLatexError] = useState<string | null>(null)
  const [isCompiling, setIsCompiling] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pdfContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSubPage = async () => {
      try {
        // Simulating API call
        const mockSubPage: SubPage = {
          id: pageId as string,
          title: 'Sample Document',
          content: '# Sample Content\n\nThis is a sample document with some content.',
        }
        setSubPage(mockSubPage)
        setTitle(mockSubPage.title)
        setContent(mockSubPage.content)
      } catch (error) {
        console.error('Error fetching subpage:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubPage()
  }, [pageId])

  useEffect(() => {
    if (format === 'latex') {
      setIsPreviewMode(true)
    }
  }, [format])

  const handleSave = () => {
    setIsSaving(true)
    // Simulating API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const handleFormatChange = (newFormat: Format) => {
    setFormat(newFormat)
    setCompiledPdfUrl(null)
    setLatexError(null)
  }

  const togglePreviewMode = () => {
    if (format !== 'latex') {
      setIsPreviewMode(!isPreviewMode)
    }
  }

  const renderPDF = async (pdfData: Uint8Array) => {
    if (!pdfContainerRef.current) return;
  
    try {
      const loadingTask = pdfjsLib.getDocument({ data: pdfData })
      const pdf = await loadingTask.promise
      const page = await pdf.getPage(1)
  
      const scale = 1.5
      const viewport = page.getViewport({ scale })
  
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
  
      if (context) {
        canvas.height = viewport.height
        canvas.width = viewport.width
  
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        }
  
        await page.render(renderContext).promise
  
        pdfContainerRef.current.innerHTML = ''
        pdfContainerRef.current.appendChild(canvas)
      }
    } catch (error) {
      console.error('Error rendering PDF:', error)
      setLatexError('Error rendering PDF. Please try again.')
    }
  }

  const handleCompile = async () => {
    setIsCompiling(true)
    setLatexError(null)
    setCompiledPdfUrl(null)
  
    try {
      const response = await api.compileLatex(content)
  
      // 检查响应是否为 JSON 格式
      if (response.headers['content-type'].includes('application/json')) {
        const data = response.data
  
        if (data.status === 'success' && data.pdfData) {
          const pdfData = base64ToUint8Array(data.pdfData)
          await renderPDF(pdfData)
          
          // Create a Blob from the PDF data
          const pdfBlob = new Blob([pdfData], { type: 'application/pdf' })
          const pdfUrl = URL.createObjectURL(pdfBlob)
          setCompiledPdfUrl(pdfUrl)
        } else {
          throw new Error(data.message || 'Compilation failed')
        }
      } else {
        throw new Error('Unexpected response format from server')
      }
    } catch (error: any) {
      console.error('LaTeX compilation error:', error)
      setLatexError(error.message || 'An error occurred during LaTeX compilation')
    } finally {
      setIsCompiling(false)
    }
  }

  const base64ToUint8Array = (base64: string) => {
    const binaryString = atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
  }

  const handleFormat = (type: string) => {
    let updatedContent = content
    const selection = window.getSelection()
    const selectedText = selection?.toString() || ''

    switch (type) {
      case 'bold':
        updatedContent = selectedText ? content.replace(selectedText, `**${selectedText}**`) : `**${content}**`
        break
      case 'italic':
        updatedContent = selectedText ? content.replace(selectedText, `*${selectedText}*`) : `*${content}*`
        break
      case 'unordered-list':
        updatedContent = selectedText ? content.replace(selectedText, `\n- ${selectedText}`) : `${content}\n- `
        break
      case 'ordered-list':
        updatedContent = selectedText ? content.replace(selectedText, `\n1. ${selectedText}`) : `${content}\n1. `
        break
      case 'image':
        updatedContent = `${content}\n![Image description](image_url)`
        break
      case 'equation':
        updatedContent = selectedText ? content.replace(selectedText, `$${selectedText}$`) : `$${content}$`
        break
      case 'symbol':
        updatedContent = `${content}α`
        break
      case 'matrix':
        updatedContent = `${content}\n\n| a | b |\n|---|---|\n| c | d |`
        break
    }
    setContent(updatedContent)
  }

  const handleExport = () => {
    if (format === 'latex' && compiledPdfUrl) {
      // Download the compiled PDF
      const a = document.createElement('a')
      a.href = compiledPdfUrl
      a.download = `${title}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      // Export as Markdown or LaTeX source
      const fileExtension = format === 'latex' ? 'tex' : 'md'
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title}.${fileExtension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-morandi-bg-light text-morandi-text-secondary">Loading...</div>
  }

  if (!subPage) {
    return <div className="flex items-center justify-center h-screen bg-morandi-bg-light text-morandi-text-secondary">Error loading document</div>
  }

  return (
    <div className="flex flex-col h-screen bg-morandi-bg-light">
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
        <Button
          variant="ghost"
          className="mr-4 text-morandi-text-secondary hover:text-morandi-text-primary"
          onClick={() => router.push(`/documents/${id}`)}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Project
        </Button>
      </DocumentHeader>
      <div className="flex items-center justify-between p-4 bg-morandi-bg-dark">
        <div className="flex items-center space-x-4">
          <Select value={format} onValueChange={(value: Format) => handleFormatChange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="latex">LaTeX</SelectItem>
            </SelectContent>
          </Select>
          <FormatToolbar format={format} onFormat={handleFormat} />
        </div>
        <div className="flex space-x-2">
          {format === 'latex' && (
            <Button variant="outline" onClick={handleCompile} disabled={isCompiling}>
              {isCompiling ? 'Compiling...' : 'Compile'}
            </Button>
          )}
          {format !== 'latex' && (
            <Button variant="outline" onClick={togglePreviewMode}>
              {isPreviewMode ? <Edit2 className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
          )}
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <div className="flex-grow overflow-hidden flex">
        <div className={`h-full ${isPreviewMode || format === 'latex' ? 'w-1/2' : 'w-full'} overflow-auto`}>
          <Editor
            content={content}
            setContent={setContent}
            isAIMode={isAIMode}
            format={format}
            onSave={handleSave}
          />
        </div>
        {(isPreviewMode || format === 'latex') && (
            <div className="w-1/2 h-full overflow-auto p-8 bg-white rounded-lg shadow-inner">
                {format === 'markdown' ? (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                    inlineMath: ({ node, ...props }) => <InlineMath math={props.children[0] as string} />,
                    math: ({ node, ...props }) => <BlockMath math={props.children[0] as string} />,
                    }}
                >
                    {content}
                </ReactMarkdown>
                ) : (
                latexError ? (
                    <div className="text-red-500">{latexError}</div>
                ) : isCompiling ? (
                    <div className="text-gray-500">Compiling LaTeX...</div>
                ) : compiledPdfUrl ? (
                    <div className="h-full flex flex-col">
                    <embed 
                        src={compiledPdfUrl} 
                        type="application/pdf"
                        width="100%"
                        height="100%"
                        className="flex-grow"
                    />
                    <Button variant="outline" asChild className="mt-4">
                        <a href={compiledPdfUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open PDF in new tab
                        </a>
                    </Button>
                    </div>
                ) : (
                    <div className="text-gray-500">Click "Compile" to see the PDF preview</div>
                )
                )}
            </div>
        )}
      </div>
    </div>
  )
}