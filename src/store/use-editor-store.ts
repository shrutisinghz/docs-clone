import {create} from 'zustand';
import { type Editor } from "@tiptap/react";

interface EditorState {
    editor: Editor | null;
    setEditor: (editor: Editor) => void;
}
// Create a store for the editor
export const useEditorStore = create<EditorState> ((set) => ({
    editor: null, //Initially there is no editor
    setEditor: (editor) => set({editor}),
}))

