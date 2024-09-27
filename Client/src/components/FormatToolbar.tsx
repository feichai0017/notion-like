import React from 'react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import {
    Bold, Italic, Underline, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Indent, Outdent,
    Type, ChevronDown
} from 'lucide-react'

const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
const fontFamilies = ['Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact']

interface FormatToolbarProps {
    fontSize: number;
    setFontSize: (size: number) => void;
    fontFamily: string;
    setFontFamily: (family: string) => void;
    textColor: string;
    setTextColor: (color: string) => void;
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
    handleFormat: (command: string, value?: string) => void;
}

export function FormatToolbar({
                                  fontSize,
                                  setFontSize,
                                  fontFamily,
                                  setFontFamily,
                                  textColor,
                                  setTextColor,
                                  backgroundColor,
                                  setBackgroundColor,
                                  handleFormat
                              }: FormatToolbarProps) {
    return (
        <div className="flex flex-wrap items-center space-x-1 p-2 border-b">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Type className="h-4 w-4 mr-2" />
                        {fontSize}
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                    <Slider
                        min={8}
                        max={72}
                        step={1}
                        value={[fontSize]}
                        onValueChange={(value) => {
                            setFontSize(value[0])
                            handleFormat('fontSize', (value[0] / 16).toString())
                        }}
                    />
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                        {fontFamily}
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                    {fontFamilies.map((font) => (
                        <Button
                            key={font}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                                setFontFamily(font)
                                handleFormat('fontName', font)
                            }}
                        >
                            {font}
                        </Button>
                    ))}
                </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon" onClick={() => handleFormat('bold')}>
                <Bold className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleFormat('italic')}>
                <Italic className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleFormat('underline')}>
                <Underline className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleFormat('strikeThrough')}>
                <Strikethrough className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleFormat('justifyLeft')}>
                <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleFormat('justifyCenter')}>
                <AlignCenter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleFormat('justifyRight')}>
                <AlignRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleFormat('justifyFull')}>
                <AlignJustify className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleFormat('insertUnorderedList')}>
                <List className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleFormat('insertOrderedList')}>
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleFormat('indent')}>
                <Indent className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleFormat('outdent')}>
                <Outdent className="h-4 w-4" />
            </Button>
            <input
                type="color"
                value={textColor}
                onChange={(e) => {
                    setTextColor(e.target.value)
                    handleFormat('foreColor', e.target.value)
                }}
                className="w-8 h-8 p-0 border-none"
            />
            <input
                type="color"
                value={backgroundColor}
                onChange={(e) => {
                    setBackgroundColor(e.target.value)
                    handleFormat('hiliteColor', e.target.value)
                }}
                className="w-8 h-8 p-0 border-none"
            />
        </div>
    )
}