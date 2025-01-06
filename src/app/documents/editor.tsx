"use client";
import React from 'react'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import ImageResize from 'tiptap-extension-resize-image'
import { useEditorStore } from '@/store/use-editor-store';
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'

const Editor = () => {

  const { setEditor } = useEditorStore();

    const editor = useEditor({
      onCreate({ editor}) {  
        // when the editor first loads up it will call onCreate and save the editor in our zustand stor
        setEditor(editor);
      },
      // When the editor is closed/removed 
      onDestroy() {
        setEditor(null);
      },
      
      onUpdate({ editor}) {
        // when someone makes a change to the editor
        setEditor(editor);
      },
      onSelectionUpdate({ editor }) {
        // When someone highlights text
        setEditor(editor);
      },
      onTransaction({ editor }) {  // When any change happens
        setEditor(editor)
    },
    onFocus({ editor }) {  // When clicking into the editor
        setEditor(editor)
    },
    onBlur({ editor }) {  // When clicking away from the editor
        setEditor(editor)
    },
    onContentError({ editor }) {  // If there's an error
        setEditor(editor)
    },
      // to avoid Tiptap Error: SSR has been detected, please set `immediatelyRender` explicitly to `false` to avoid hydration mismatches.
      immediatelyRender: false,

        editorProps:{
            attributes: {
                style: "padding-left: 56px; padding-right: 56px;",
                class: 'focus:outline-none print:border-none bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
        },
        },
        extensions: [
          StarterKit, 
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
          Link.configure({
              openOnClick: false, // prevents auto-opening links when clicked
              HTMLAttributes: {
                class: 'cursor-pointer text-blue-500 hover:underline'
              },
             
         }),

         TextStyle,
          Color,
          // to avoid default yellow color
          Highlight.configure({
            multicolor: true,
          }),
          
          FontFamily,
          ImageResize,
          TaskItem, 
          TaskItem.configure({
            nested: true,
          }),
          TaskList, 
          Text,
          Table.configure({
            resizable: true,
          }),
          TableRow,
          TableHeader,
          TableCell,
        ],
        content: `
        <p>Hello World! 🌎️</p>

        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Singer</td>
              <td>Songwriter</td>
              <td>Actress</td>
            </tr>
          </tbody>
        </table>

        <p>This is a basic example of implementing images. Drag to re-order.</p>
        <img src="https://placehold.co/800x400" />
        <img src="https://placehold.co/800x400/6A00F5/white" />
      `
      })
    
      return (
        <div className='size-full overflow-x-auto bg-[#FAFBFD] px-4 print:p-0 print:bg-white print:overflow-visible'>
            <div className='min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0'>
             <EditorContent editor={editor} />
            </div>
        </div>
      )
}
export default Editor;

