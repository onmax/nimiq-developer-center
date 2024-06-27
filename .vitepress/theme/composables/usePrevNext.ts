import { computed } from 'vue'
import { isActive } from './useIsActive'
import { useData } from './useData'
import { getFlatSideBarLinks, getSidebar } from './useSidebar'

interface PrevNext { text?: string, link?: string }
export function usePrevNext() {
  const { page, theme, frontmatter } = useData()

  function getItem(direction: 'prev' | 'next') {
    const sidebar = getSidebar(theme.value.sidebar, page.value.relativePath)
    const candidates = getFlatSideBarLinks(sidebar)

    const index = candidates.findIndex(link => isActive(page.value.relativePath, link.link))
    const t = (theme.value as { prev?: string | PrevNext, next?: string | PrevNext })[direction]

    const hideFromFrontmatter = frontmatter.value.docFooter === false
    const hide = hideFromFrontmatter || (theme.value.docFooter?.[direction] === false && !frontmatter.value[direction]) || frontmatter.value[direction] === false
    if (hide)
      return
    if (t)
      return typeof t === 'string' ? { text: t, link: undefined } : t

    const candidate = candidates.at(direction === 'prev' ? index - 1 : index + 1)
    return { text: candidate?.docFooterText ?? candidate?.text, link: candidate?.link }
  }

  const next = computed(() => getItem('next'))
  const prev = computed(() => getItem('prev'))

  return {
    next,
    prev,
    hasNext: computed(() => !!next.value?.text),
    hasPrev: computed(() => !!prev.value?.text),
  }
}
