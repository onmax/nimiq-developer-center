import { existsSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { env } from 'node:process'
import { defineConfig } from 'vitepress'
import { spawn } from 'cross-spawn'
import { readPackageJSON } from 'pkg-types'
import { sidebar } from './sidebar.config'
import { navigation } from './navigation.config'

// @unocss-include

// https://vitepress.dev/reference/site-config
export default async () => {
  const { title, description, homepage } = await readPackageJSON()
  const isProduction = env.NODE_ENV === 'production'
  const baseUrl = isProduction ? '/developers' : '/developer-center/'

  return defineConfig({
    base: baseUrl,
    title,
    srcExclude: ['**/README.md'],
    description,
    lastUpdated: true,
    cleanUrls: true,

    async transformPageData(pageData) {
      function getCommitHash(file: string): Promise<string | undefined> {
        return new Promise<string | undefined>((resolve, reject) => {
          const cwd = dirname(file)
          if (!existsSync(cwd))
            return resolve(undefined)
          const fileName = basename(file)
          const child = spawn('git', ['log', '-1', '--pretty="%H"', fileName], { cwd })
          let output = ''
          child.stdout.on('data', d => (output += String(d)))
          child.on('close', () => resolve(output.trim().replace(/"/g, '')))
          child.on('error', reject)
        })
      }
      pageData.updatedCommitHash = await getCommitHash(pageData.filePath)
    },

    themeConfig: {
      navigation,

      sidebar,

      footerItems: [
        {
          link: 'https://forum.nimiq.community',
          icon: 'i-nimiq:logos-nimiq-forum-mono',
          text: 'Question? Checkout the ',
          social: 'Nimiq Forum',
        },
        {
          link: 'https://t.me/nimiq',
          icon: 'i-nimiq:logos-telegram-mono',
          text: 'Give us feedback on ',
          social: 'Telegram',
        },
      ],

      search: { provider: 'local' },
    },

    vite: {
      configFile: '.vitepress/vite.config.ts',
    },

    markdown: {
      math: true, // Allow latex math
    },

    head: [
      ['meta', { name: 'theme-color', content: '#ffffff' }],
      ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: `${baseUrl}favicons/apple-touch-icon.png` }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${baseUrl}favicons/favicon-32x32.png` }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${baseUrl}favicons/favicon-16x16.png` }],
      // ['link', { rel: 'manifest', href: `${baseUrl}favicons/site.webmanifest` }],
      ['link', { rel: 'mask-icon', href: `${baseUrl}favicons/safari-pinned-tab.svg`, color: '#eaaf0c' }],
      ['link', { rel: 'shortcut icon', href: `${baseUrl}favicons/favicon.ico` }],
      ['meta', { name: 'msapplication-TileColor', content: '#2b5797' }],
      ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],

      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: homepage }],
      ['meta', { property: 'og:image', content: `${baseUrl}og-image.png` }],
      ['meta', { property: 'og:site_name', content: title }],
      ['meta', { property: 'og:determiner', content: 'the' }],
      ['meta', { property: 'og:locale', content: 'en_US' }],
      ['meta', { property: 'og:type', content: 'website' }],

      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:site', content: '@nimiq' }],
      ['meta', { name: 'twitter:creator', content: '@nimiq' }],
      ['meta', { name: 'twitter:title', content: title }],
    ],

    sitemap: {
      hostname: 'https://nimiq.com/developers',
    },

  })
}
