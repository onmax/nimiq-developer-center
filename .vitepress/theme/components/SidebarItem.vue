<script setup lang="ts">
import type { DefaultTheme } from 'vitepress'
import { Accordion } from 'radix-vue/namespaced'
import { useSidebarControl } from '../composables/useSidebar'

type SidebarItem = DefaultTheme.SidebarItem & { icon: string, items: SidebarItem[], prefix: string }
const props = defineProps<{
  item: SidebarItem
  depth: number
}>()

const {
  collapsed,
  isActiveLink,
  hasActiveLink,
  hasChildren,
} = useSidebarControl(computed(() => props.item))
const linkRef = ref<HTMLAnchorElement | null>(null)

watch(isActiveLink, () => {
  if (isActiveLink.value) {
    globalThis.window.requestAnimationFrame(() => {
      linkRef.value.scrollIntoView({
        behavior: 'instant',
        block: 'center',
        inline: 'nearest',
      })
    })
  }
})

const { site } = useData()
function normalizeLink(url: string): string {
  if (!url)
    return

  const { pathname, search, hash, protocol } = new URL(url, 'http://a.com')

  if (
    isExternal(url)
    || url.startsWith('#')
    || !protocol.startsWith('http')
    || !treatAsHtml(pathname)
  ) {
    return url
  }

  const normalizedPath
    = pathname.endsWith('/') || pathname.endsWith('.html')
      ? url
      : url.replace(
        // eslint-disable-next-line regexp/optimal-quantifier-concatenation
        /(?:(^\.+)\/)?.*$/,
          `$1${pathname.replace(
            /(\.md)?$/,
            site.value.cleanUrls ? '' : '.html',
          )}${search}${hash}`,
      )

  return withBase(normalizedPath)
}

const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i

function isExternal(path: string): boolean {
  return EXTERNAL_URL_RE.test(path)
}

const KNOWN_EXTENSIONS = new Set()

function treatAsHtml(filename: string): boolean {
  if (KNOWN_EXTENSIONS.size === 0) {
    const extraExts
      = (typeof process === 'object' && process.env.VITE_EXTRA_EXTENSIONS)
      || (import.meta as any).env?.VITE_EXTRA_EXTENSIONS
      || ''

    // md, html? are intentionally omitted
    ;(
      `3g2,3gp,aac,ai,apng,au,avif,bin,bmp,cer,class,conf,crl,css,csv,dll,`
      + `doc,eps,epub,exe,gif,gz,ics,ief,jar,jpe,jpeg,jpg,js,json,jsonld,m4a,`
      + `man,mid,midi,mjs,mov,mp2,mp3,mp4,mpe,mpeg,mpg,mpp,oga,ogg,ogv,ogx,`
      + `opus,otf,p10,p7c,p7m,p7s,pdf,png,ps,qt,roff,rtf,rtx,ser,svg,t,tif,`
      + `tiff,tr,ts,tsv,ttf,txt,vtt,wav,weba,webm,webp,woff,woff2,xhtml,xml,`
      + `yaml,yml,zip${
      extraExts && typeof extraExts === 'string' ? `,${extraExts}` : ''}`
    )
      .split(',')
      .forEach(ext => KNOWN_EXTENSIONS.add(ext))
  }

  const ext = filename.split('.').pop()

  return ext == null || !KNOWN_EXTENSIONS.has(ext.toLowerCase())
}
</script>

<template>
  <div>
    <a v-if="!hasChildren" ref="linkRef" :rel="item.rel" :href="normalizeLink(item.link)" :target="item.target" flex="~ items-center gap-8" :class="{ 'font-bold text-blue': isActiveLink, 'op-80': !isActiveLink }" transition-all py-8 border="1.5 neutral-600">
      <div w-2 h-19 :bg="isActiveLink ? 'blue' : 'transparent'" transition-colors />
      {{ item.text }}
    </a>

    <Accordion.Root v-else type="single" :default-value="(collapsed || hasActiveLink) ? item.text : ''" collapsible>
      <Accordion.Item :value="item.text">
        <Accordion.Header as="div">
          <div flex="~ items-center gap-8" w-full border="1.5 neutral-600" pl-12>
            <span flex-1>{{ item.text }}</span>
            <Accordion.Trigger class="group" border-l="1.5 neutral-600 solid" h-full self-stretch p-12 bg-neutral-400>
              <div i-nimiq:chevron-down text="10 neutral-900" op70 transition-transform duration-300 rotate="-90 group-data-[state=open]:!0" />
            </Accordion.Trigger>
          </div>
        </Accordion.Header>
        <Accordion.Content class="accordion-content" of-hidden pb-8>
          <ul relative>
            <li v-for="sub in item.items " :key="sub.text">
              <SidebarItem :item="sub" :depth="depth + 1" />
            </li>
          </ul>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </div>
</template>

<style>
@keyframes slideDown {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes slideUp {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}

.accordion-content[data-state="open"] {
  animation: slideDown 300ms ease-out;
}

.accordion-content[data-state="closed"] {
  animation: slideUp 300ms ease-out;
}
</style>
