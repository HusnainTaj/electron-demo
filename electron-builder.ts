import type { Configuration } from 'electron-builder'

import
{
    main,
    name,
    version,
    resources,
    description,
    displayName,
    author as _author,
} from './package.json'

import { getDevFolder } from './src/lib/electron-app/release/utils/path'

const author = _author?.name ?? _author
const currentYear = new Date().getFullYear()
const authorInKebabCase = author.replace(/\s+/g, '-')
const appId = `com.${authorInKebabCase}.${name}`.toLowerCase()

const artifactName = [`${name}-v${version}`, '-${os}.${ext}'].join('')

export default {
    appId,
    productName: displayName,
    copyright: `Copyright © ${currentYear} — ${author}`,

    directories: {
        app: getDevFolder(main),
        output: `dist/v${version}`,
    },

    mac: {
        artifactName,
        icon: `${resources}/build/icons/icon.icns`,
        category: 'public.app-category.utilities',
        target: ['zip', 'dmg'],
    },
    linux: {
        artifactName,
        category: 'Utilities',
        synopsis: description,
        target: ['AppImage', 'deb', 'rpm'],
        desktop: {
            "Name": displayName,
            "Icon": `${resources}/build/icons/icon.png`,
            "Comment": description,
            "Categories": "Utilities"
        },
    },
    win: {
        artifactName,
        icon: `${resources}/build/icons/icon.ico`,
        target: ['nsis', 'zip'],
    },
    nsis: {
        allowToChangeInstallationDirectory: true,
        oneClick: false,
    },
    publish: {
        provider: 'github',
        owner: "HusnainTaj",
        repo: "electron-demo",
    }
} satisfies Configuration
