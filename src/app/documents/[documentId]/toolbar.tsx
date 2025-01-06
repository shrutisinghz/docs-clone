"use client";
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";

import { Separator } from "@/components/ui/separator";
import {  
    LucideIcon, 
    Redo2Icon, 
    Undo2Icon, 
    PrinterIcon, 
    SpellCheckIcon, 
    BoldIcon, 
    ChevronDownIcon, 
    HighlighterIcon, 
    Link2Icon, 
    UploadIcon,
    AlignCenterIcon, 
    AlignRightIcon, 
    AlignLeftIcon, 
    AlignJustifyIcon, ListIcon, ListOrderedIcon } from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {type Level} from "@tiptap/extension-heading";
import { type ColorResult, SketchPicker } from "react-color";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';

const ListButton = () => {
    const {editor} = useEditorStore();

    const lists = [
        {
            label: "Bullet List",
            icon: ListIcon,
            isActive: () => editor?.isActive("bulletList"),
            OnClick: () => editor?.chain().focus().toggleBulletList().run(),
        },
        {
            label: "Ordered List",
            icon: ListOrderedIcon,
            isActive: () => editor?.isActive("orderedList"),
            OnClick: () => editor?.chain().focus().toggleOrderedList().run(),
        },
    ]

    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                 className="h-9 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-300/80 px-1.5 overflow-hidden text-sm">
                    <ListIcon className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
            {lists.map(({ label, isActive, OnClick, icon: Icon }) => (
                <button 
                key={label}
                onClick={OnClick}
                className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80", 
                isActive() && "bg-neutral-200/80"
            )}
                >
                    <Icon className='size-4' />
                    <span className='text-sm'> {label} </span>
                </button> 
                
            ))}
               
            </DropdownMenuContent>
        </DropdownMenu>

        </>
    )
}
const AlignButton = () => {
    const {editor} = useEditorStore();

    const alignments = [
            {
                label: "Align Left",
                value: "left",
                icon: AlignLeftIcon,
            },
            {
                label: "Align Center",
                value: "center",
                icon: AlignCenterIcon,
            },
            {
                label: "Align Right",
                value: "right",
                icon: AlignRightIcon,
            },
            {
                label: "Align Justify",
                value: "justify",
                icon: AlignJustifyIcon,
            }
        
    ]

    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                 className="h-9 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-300/80 px-1.5 overflow-hidden text-sm">
                    <AlignLeftIcon className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
            {alignments.map(({ label, value, icon: Icon }) => (
                <button 
                key={value}
                onClick={() => editor?.chain().focus().setTextAlign(value).run()}
                className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80", 
                editor?.isActive({ textAlign: value}) && "bg-neutral-200/80"
            )}
                >
                    <Icon className='size-4' />
                    <span className='text-sm'> {label} </span>
                </button> 
                
            ))}
               
            </DropdownMenuContent>
        </DropdownMenu>

        </>
    )
}
const ImageButton = () => {
    const { editor } = useEditorStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const onChange = (src: string) => {
        editor?.chain().focus().setImage({ src }).run();
    };
    const onUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file){
                const imageUrl = URL.createObjectURL(file);
                onChange(imageUrl);
            }
        }
        input.click();
    }
    const handleImageUrlSubmit = () => { 
        if(imageUrl) {
            onChange(imageUrl);
            setImageUrl("");
            setIsDialogOpen(false);
        }
    };

    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                
                 className="h-9 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-300/80 px-1.5 overflow-hidden text-sm">
                    <Link2Icon className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5 flex item-center gap-x-2">
                <DropdownMenuItem onClick={onUpload}>
                    <UploadIcon className="size-4" />
                    <span>Upload</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                    <UploadIcon className="size-4" />
                    <span>Paste Image URL</span>
                </DropdownMenuItem>
               
            </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Insert Image URL</DialogTitle>
                </DialogHeader>

                <Input
                placeholder='Insert Image URL'
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleImageUrlSubmit();
                    }
                }}
                />

                <DialogFooter>
                    <Button onClick={handleImageUrlSubmit}>Insert</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}

const LinkButton = () => {
    const { editor } = useEditorStore();
    const [value, setValue] = useState(editor?.getAttributes("link").href || "");

    const onChange = (href: string) => {
        editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
        setValue("");
    }
    return (
        <DropdownMenu
        onOpenChange={(isOpen) => {
            if (isOpen) {
                setValue(editor?.getAttributes("link").href || "")
        }}
    }>
            <DropdownMenuTrigger asChild>
                <button
                
                 className="h-9 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-300/80 px-1.5 overflow-hidden text-sm">
                    <Link2Icon className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5 flex item-center gap-x-2">
                <Input 
                placeholder='https://example.com'
                value={value}
                onChange={(e) => setValue(e.target.value)}
                />
                <Button onClick={() => onChange(value)}/>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
const HighlightColorButton = () => {
    const { editor } = useEditorStore();

    // get the current highlight color or fallback too FFFF00
    const value = editor?.getAttributes("highlight")?.color || "#000000";

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setHighlight({color: color.hex}).run();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-9 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-300/80 px-1.5 overflow-hidden text-sm">
                    <HighlighterIcon className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <SketchPicker onChange={onChange} color={value} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
                                                          
}
const TextColorButton = () => {
    const { editor } = useEditorStore();
    const  value = editor?.getAttributes("textStyle").color || "#000000";

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-9 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-300/80 px-1.5 overflow-hidden text-sm">
                    <span className="text-sm">A</span>
                    <div className="h-0.5 w-full" style={{ backgroundColor: value }}></div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <SketchPicker color={value} onChange={onChange} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
                                                          
}

const HeadingLevelButton = () => {
    const { editor }= useEditorStore();

    const headings = [
        {label: "Normal text", value: 0, fontSize: "16px"},
        {label: "Heading 2",   value: 1, fontSize: "32px"},
        {label: "Heading 3",   value: 2, fontSize: "24px"},
        {label: "Heading 4",   value: 3, fontSize: "20px"},
        {label: "Heading 5",   value: 4, fontSize: "18px"},
        {label: "Heading 6",   value: 5, fontSize: "16px"},
    ]

const getCurrentHeading = () => {
    for(let level=1; level <=5; level++){
        if(editor?.isActive("heading", { level } )) {
            return `Heading  ${level}`;
        }
    }
    return "Normal text";
}

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-300/80 px-1.5 overflow-hidden text-sm"> 
                    <span className="truncate">
                       { getCurrentHeading()}
                    </span>
                    <ChevronDownIcon className="ml-2 size-4 shrink-0"/>
                </button>
            </DropdownMenuTrigger>
    
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {headings.map(({ label, value, fontSize }) => (
                    <button
                        key={value}
                        onClick={() =>  {
                            if (value === 0) {
                                editor?.chain().focus().setParagraph().run();
                            }
                            else {
                                editor?.chain().focus().toggleHeading({ level: value as Level }).run();
                            }
                            }
                        }
                        style={{fontSize}}
                        className={cn(
                            "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                            (value === 0 && !editor?.isActive("heading")) || (value > 0 && editor?.isActive("heading", { level: value })) && "bg-neutral-200/80",
                        )}
                    >
                        {label}
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export const FontFamilyButton = () => {
  const { editor } = useEditorStore();

  const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
    { label: "Comic Sans MS", value: "Comic Sans MS" },
  ]
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-300/80 px-1.5 overflow-hidden text-sm"> 
                <span className="truncate">
                    {editor?.getAttributes("textStyle").fontFamily ?? "Arial"}
                </span>
                <ChevronDownIcon className="ml-2 size-4 shrink-0"/>
            </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
            {fonts.map(( {label, value} ) => {
                return (
                    <button
                    onClick={() => editor?.chain().focus().setFontFamily(value).run()}
                    key={label}
                    className={cn(
                        "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                        editor?.getAttributes("textStyle").fontFamily === value && "bg-neutral-200/80",
                    )}
                    style={{fontFamily: value}}
                    >
                        <span className="text-sm">{label}</span>

                    </button>
                )
            })}
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Toolbar button
interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    icon: LucideIcon;
}
const ToolbarButton = ({
    onClick,
    isActive, 
    icon: Icon,
}: ToolbarButtonProps) => {
    return (
        <button
        onClick={onClick}
        className={cn(
            "text-sm h-9 w-9 min-w-7 items-center justify-center rounded-sm hover:bg-neutral-200/80",
        isActive && "bg-neutral-200/80",)}    
        >
            <Icon />
        </button>
    )
}

interface Section {
    label: string;
    icon: LucideIcon;
    onclick: () => void;
    isActive?: boolean;
}

const Toolbar = () => {
    const {editor} = useEditorStore()
    //console.log(editor);
    // toolbar section
    const sections: Section[][] = [
        [
            {
                label: "Undo",
                icon: Undo2Icon,
                onclick: () => editor?.chain().focus().undo().run(),
            },
            {
                label: "Redo",
                icon: Redo2Icon,
                onclick: () => editor?.chain().focus().redo().run(),
            },
            {
                label: "Print",
                icon: PrinterIcon,
                onclick: () => window.print(),
            },
            {
                label: "Spell Check",
                icon: SpellCheckIcon,
                onclick: () => {
                    const current = editor?.view.dom.getAttribute("spellcheck");
                    editor?.view.dom.setAttribute("spellcheck", current === "false" ? "true" : "false");
                    console.log(current);
                }
            },
        ],
        [
            {
                label: "Bold",
                icon: BoldIcon,
                onclick: () => editor?.chain().focus().toggleBold().run(),
            }
        ]
    ];
  return (
    <div className='bg-[#f3f7ff] px-2.5 PY-0.5 rounded-[24px]  flex items-center gap-x-0.5 overflow-x-auto '>
        {sections[0].map((item) => {
            return (
                <ToolbarButton key={item.label}
                onClick={item.onclick}
                isActive={item.isActive ?? false}
                icon={item.icon}
                />

            )
        })}

        
        <Separator orientation="vertical" className="h-8 bg-neutral-300"/>
         <FontFamilyButton />
        <Separator orientation="vertical" className="h-8 bg-neutral-300"/>
            <HeadingLevelButton />
        <Separator orientation="vertical" className="h-8 bg-neutral-300"/>
        {/* Todo font:size */}
        <Separator orientation="vertical" className="h-8 bg-neutral-300"/>
        {sections[1].map((item) => {
           return (
            <ToolbarButton 
            key={item.label} 
            icon={item.icon}
            onClick={item.onclick}
            isActive={item.isActive}
             />
           )
        })}

        <Separator orientation="vertical" className="h-8 bg-neutral-300"/>
        {/* Todo TEXT:COLOR */}
        <TextColorButton />
        {/* Todo HIGHLIGHTER:COLOR */}
        <HighlightColorButton />
        {/* Todo : LINK */}
        <LinkButton />
        {/* Todo : IMAGE */}
        <ImageButton />
        {/* Todo : ALIGN */}
        <AlignButton />
        {/* Todo : LINEHEIGHT */}
        <ListButton />
    </div>
  )
}

export default Toolbar