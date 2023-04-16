import { defineConfig } from 'vite'
import { crx, defineManifest } from '@crxjs/vite-plugin'

const manifest = defineManifest({
    "manifest_version": 3,
    "name": "YamahaPartsLinker",
    "version": "1.0.1",
    "description": "YAMAHAのパーツカタログでページの機能を拡張し、利便性を向上させます",
    "host_permissions": [
        "https://ypec-sss.yamaha-motor.co.jp/*"
    ],
    "content_scripts": [
        {
            "matches": [
                "https://ypec-sss.yamaha-motor.co.jp/ypec/ypec/b2c/html5/app/ja/parts-search/index.html"
            ],
            "js": [
                "src/YamahaPartsListEnhancer.ts"
            ]
        }
    ]
})


export default defineConfig({
    plugins: [crx({ manifest })],
})