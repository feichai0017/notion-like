'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/app/api/completion/route'
import { DocumentHeader } from '@/components/DocumentHeader'
import { Editor } from '@/components/Editor'
import { FormatToolbar } from '@/components/FormatToolbar'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Play, Edit2, Eye, Download, ExternalLink, ZoomIn, ZoomOut } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { debounce } from 'lodash'
import * as pdfjsLib from 'pdfjs-dist'
import mermaid from 'mermaid'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.min.mjs`
mermaid.initialize({ startOnLoad: false })

type SubPage = {
  id: string
  title: string
  content: string
}

type Format = 'latex' | 'markdown' | 'mermaid'

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
  const [autoCompile, setAutoCompile] = useState(false)
  const [mermaidSvg, setMermaidSvg] = useState<string | null>(null)
  const [mermaidScale, setMermaidScale] = useState(1)
  const pdfContainerRef = useRef<HTMLDivElement>(null)
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [pdfPageNum, setPdfPageNum] = useState(1)
  const [pdfNumPages, setPdfNumPages] = useState(0)
  const pdfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSubPage = async () => {
      try {
        // const response = await api.getDocument(pageId as string)
        // const fetchedSubPage = response.data
        const mockSubPage: SubPage = {
          id: pageId as string,
          title: 'Sample Document',
          content: '# Sample Content\n\nThis is a sample document with some content.\n\n```mermaid\ngraph TD;\n    A[Client] -->|TCP Connection| B(Load Balancer)\n    B -->|Forwards Request| C{Web Server}\n    C -->|Processes Request| D[Database]\n    C -->|Sends Response| A\n```',
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
    if (format === 'mermaid' && isPreviewMode) {
      renderMermaidDiagram()
    }
  }, [content, format, isPreviewMode])

  useEffect(() => {
    if (format === 'latex' && autoCompile) {
      compileLatex(content)
    }
  }, [content, format, autoCompile])

  const renderMermaidDiagram = async () => {
    try {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Arial, sans-serif',
      })
      const { svg } = await mermaid.render('mermaid-diagram', content)
      setMermaidSvg(svg)
    } catch (error) {
      console.error('Error rendering Mermaid diagram:', error)
      setMermaidSvg(`<pre>${content}</pre>`)
    }
  }

  const handleSave = useCallback(debounce(async () => {
    setIsSaving(true)
    // Simulating API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }, 1000), [])
  //   try {
  //     await api.updateDocument(pageId as string, { title, content })
  //   } catch (error) {
  //     console.error('Error saving document:', error)
  //   } finally {
  //     setIsSaving(false)
  //   }
  // }, 1000), [pageId, title, content])

  const handleFormatChange = (newFormat: Format) => {
    setFormat(newFormat)
    setCompiledPdfUrl(null)
    setLatexError(null)
    setIsPreviewMode(newFormat === 'latex')
  }

  const togglePreviewMode = () => {
    if (format !== 'latex') {
      setIsPreviewMode(!isPreviewMode)
    }
  }

  const handleFormat = (type: string) => {
    // Implement formatting logic here
  }

  const handleExport = () => {
    // Implement export logic here
  }

  const zoomInMermaid = () => setMermaidScale(prevScale => Math.min(prevScale + 0.1, 2))
  const zoomOutMermaid = () => setMermaidScale(prevScale => Math.max(prevScale - 0.1, 0.5))

  const compileLatex = useCallback(debounce(async (latexContent: string) => {
    setIsCompiling(true)
    setLatexError(null)
  
    try {
      const response = await api.compileLatex(latexContent)
  
      if (response.data && response.data.status === 'success' && response.data.pdfData) {
        const pdfData = base64ToUint8Array(response.data.pdfData)
        const pdfBlob = new Blob([pdfData], { type: 'application/pdf' })
        const pdfUrl = URL.createObjectURL(pdfBlob)
        setCompiledPdfUrl(pdfUrl)
      } else {
        throw new Error(response.data?.message || 'Compilation failed')
      }
    } catch (error: any) {
      console.error('LaTeX compilation error:', error)
      setLatexError(error.message || 'An error occurred during LaTeX compilation')
    } finally {
      setIsCompiling(false)
    }
  }, 1000), [])
  
  // 更新 renderPDF 函数
  const renderPDF = async (pdfUrl: string) => {
    if (!pdfRef.current) return
  
    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl)
      const pdf = await loadingTask.promise
      setPdfNumPages(pdf.numPages)
  
      const page = await pdf.getPage(pdfPageNum)
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
  
        pdfRef.current.innerHTML = ''
        pdfRef.current.appendChild(canvas)
      }
    } catch (error) {
      console.error('Error rendering PDF:', error)
      setLatexError('Error rendering PDF. Please try again.')
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
              <SelectItem value="mermaid">Mermaid</SelectItem>
            </SelectContent>
          </Select>
          <FormatToolbar format={format} onFormat={handleFormat} />
        </div>
        <div className="flex items-center space-x-2">
          {format === 'latex' && (
            <>
              <Button
                onClick={() => setAutoCompile(!autoCompile)}
                variant={autoCompile ? "default" : "outline"}
                className="text-sm"
              >
                {autoCompile ? "Auto Compile: On" : "Auto Compile: Off"}
              </Button>
              <Button
                onClick={() => compileLatex(content)}
                disabled={isCompiling}
                variant="outline"
                className="text-sm"
              >
                {isCompiling ? "Compiling..." : "Compile"}
              </Button>
            </>
          )}
          {format !== 'latex' && (
            <Button variant="outline" onClick={togglePreviewMode} className="text-sm">
              {isPreviewMode ? <Edit2 className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
          )}
          <Button variant="outline" onClick={handleExport} className="text-sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <div className="flex-grow overflow-hidden flex">
        <div className={`${isPreviewMode || format === 'latex' ? 'w-1/2' : 'w-full'} h-full`}>
          <Editor
            content={content}
            setContent={setContent}
            isAIMode={isAIMode}
            format={format}
            onSave={handleSave}
            isPreviewMode={isPreviewMode || format === 'latex'}
          />
        </div>
        {(isPreviewMode || format === 'latex') && (
          <div className="w-1/2 h-full overflow-auto p-8 bg-white rounded-lg shadow-inner">
            {format === 'markdown' && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-4 mb-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-3 mb-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-2 mb-1" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                  inlineMath: ({ node, ...props }) => <InlineMath math={props.children[0] as string} />,
                  math: ({ node, ...props }) => <BlockMath math={props.children[0] as string} />,
                  code: ({node, inline, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <div className={match[1] === 'mermaid' ? 'mermaid' : ''}>
                        <pre className={`${className} p-4 bg-gray-100 rounded overflow-x-auto`}>
                          <code {...props}>{children}</code>
                        </pre>
                      </div>
                    ) : (
                      <code className={`${className} px-1 bg-gray-100 rounded`} {...props}>{children}</code>
                    )
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            )}
            {format === 'mermaid' && (
              <div className="flex flex-col h-full">
                <div className="flex justify-end mb-4">
                  <Button onClick={zoomOutMermaid} variant="outline" size="sm" className="mr-2">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button onClick={zoomInMermaid} variant="outline" size="sm">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative w-full h-full overflow-auto flex items-center justify-center">
                  <div
                    ref={mermaidRef}
                    className="mermaid-diagram"
                    style={{
                      transform: `scale(${mermaidScale})`,
                      transformOrigin: 'center center',
                    }}
                    dangerouslySetInnerHTML={{ __html: mermaidSvg || '' }}
                  />
                </div>
              </div>
            )}
            {format === 'latex' && (
              <div className="h-full flex flex-col">
                {latexError ? (
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
                  <div className="text-gray-500">
                    {autoCompile ? "Edit LaTeX to see preview" : "Click 'Compile' to see preview"}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
