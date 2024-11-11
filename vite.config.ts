import {defineConfig} from 'vite'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'src/editor/assets/svg')], //svg地址
            symbolId: 'icon-[dir]-[name]'
        })
    ],
    resolve: {
        alias: {
            '@': '/src',
            '@editor': '/src/editor'
        }
    },
    css: {
        modules: {
            hashPrefix: 'prefix',
            generateScopedName: '[name]__[local]__[hash:base64:5]'
        },
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    server: {
        port: 8080
    }
})
