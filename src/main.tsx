import {createRoot} from 'react-dom/client'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
// @ts-ignore
import 'virtual:svg-icons-register'
import '@/styles/index.css'
import Editor from '@editor/layouts'

createRoot(document.getElementById('root')!).render(
    <DndProvider backend={HTML5Backend}>
        <Editor></Editor>
    </DndProvider>
)
