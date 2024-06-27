import type { DefaultTheme } from 'vitepress/theme'
import {
  type ComputedRef,
  computed,
  onMounted,
  ref,
  watch,
  watchEffect,
} from 'vue'
import { isActive } from './useIsActive'
import { useData } from './useData'
import { hashRef } from './useHash'

export interface SidebarLink {
  text: string
  link: string
  docFooterText?: string
}

type SidebarItem = DefaultTheme.SidebarItem

export function getSidebar(_sidebar: DefaultTheme.Sidebar | undefined, path: string): SidebarItem[] {
  if (Array.isArray(_sidebar))
    return addBase(_sidebar)
  if (!_sidebar)
    return []

  path = ensureStartingSlash(path)

  const dir = Object.keys(_sidebar)
    .sort((a, b) => {
      return b.split('/').length - a.split('/').length
    })
    .find((dir) => {
      // make sure the multi sidebar key starts with slash too
      return path.startsWith(ensureStartingSlash(dir))
    })

  const sidebar = dir ? _sidebar[dir] : []
  return Array.isArray(sidebar) ? addBase(sidebar) : addBase(sidebar.items, sidebar.base)
}

function addBase(items: SidebarItem[], _base?: string): SidebarItem[] {
  return [...items].map((_item) => {
    const item = { ..._item }
    const base = item.base || _base
    if (base && item.link)
      item.link = base + item.link
    if (item.items)
      item.items = addBase(item.items, base)
    return item
  })
}

export function ensureStartingSlash(path: string): string {
  return /^\//.test(path) ? path : `/${path}`
}

export function getFlatSideBarLinks(sidebar: SidebarItem[]): SidebarLink[] {
  const links: SidebarLink[] = []

  function recursivelyExtractLinks(items: SidebarItem[]) {
    for (const item of items) {
      if (item.text && item.link) {
        links.push({
          text: item.text,
          link: item.link,
          docFooterText: item.docFooterText,
        })
      }

      if (item.items)
        recursivelyExtractLinks(item.items)
    }
  }

  recursivelyExtractLinks(sidebar)

  return links
}

/**
 * Get or generate sidebar group from the given sidebar items.
 */
export function getSidebarGroups(sidebar: SidebarItem[]): SidebarItem[] {
  const groups: SidebarItem[] = []

  let lastGroupIndex: number = 0

  for (const index in sidebar) {
    const item = sidebar[index]

    if (item.items) {
      lastGroupIndex = groups.push(item)
      continue
    }

    if (!groups[lastGroupIndex])
      groups.push({ items: [] })

    groups[lastGroupIndex]!.items!.push(item)
  }

  return groups
}

/**
 * Check if the given sidebar item contains any active link.
 */
export function containsActiveLink(path: string, items: SidebarItem | SidebarItem[]): boolean {
  if (Array.isArray(items))
    return items.some(item => containsActiveLink(path, item))
  if (isActive(path, items?.link))
    return true
  if (items?.items)
    return containsActiveLink(path, items.items)
  return false
}

export function useSidebar() {
  const { frontmatter, page, theme } = useData()

  const _sidebar = computed(() => {
    const sidebarConfig = theme.value.sidebar
    const relativePath = page.value.relativePath
    return sidebarConfig ? getSidebar(sidebarConfig, relativePath) : []
  })

  const sidebar = ref(_sidebar.value)

  watch(_sidebar, (next, prev) => {
    if (JSON.stringify(next) !== JSON.stringify(prev))
      sidebar.value = _sidebar.value
  })

  const hasSidebar = computed(() => {
    return (
      frontmatter.value.sidebar !== false
      && sidebar.value.length > 0
      && frontmatter.value.layout !== 'home'
    )
  })

  const hasAside = computed(() => {
    if (frontmatter.value.layout === 'home')
      return false
    if (frontmatter.value.aside != null)
      return !!frontmatter.value.aside
    return theme.value.aside !== false
  })

  const leftAside = computed(() => {
    if (!hasAside)
      return false
    return frontmatter.value.aside == null ? theme.value.aside === 'left' : frontmatter.value.aside === 'left'
  })

  const sidebarGroups = computed(() => hasSidebar.value ? getSidebarGroups(sidebar.value) : [])

  return {
    sidebarGroups,
    hasSidebar,
    hasAside,
    leftAside,
  }
}

export function useSidebarControl(
  item: ComputedRef<DefaultTheme.SidebarItem>,
) {
  const { page } = useData()

  const collapsed = ref(false)
  const collapsible = computed(() => item.value.collapsed != null)

  const isActiveLink = ref(false)
  const updateIsActiveLink = () => {
    isActiveLink.value = isActive(page.value.relativePath, item.value.link)
  }

  watch([page, item, hashRef], updateIsActiveLink)
  onMounted(updateIsActiveLink)

  const hasActiveLink = computed(() => {
    if (isActiveLink.value)
      return true
    if (item.value)
      return containsActiveLink(page.value.relativePath, item.value.items)
    return false
  })

  const hasChildren = computed(() => (item.value.items?.length || 0) > 0)

  watchEffect(() => {
    collapsed.value = collapsible.value && item.value.collapsed
  })

  watchEffect(() => {
    if (isActiveLink.value || hasActiveLink.value)
      collapsed.value = false
  }, { flush: 'post' })

  return {
    collapsed,
    isActiveLink,
    hasActiveLink,
    hasChildren,
  }
}
