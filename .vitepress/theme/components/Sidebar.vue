<script lang="ts" setup>
import { useScrollLock } from '@vueuse/core'
import type { DefaultTheme } from 'vitepress'
import { Accordion } from 'radix-vue/namespaced'
import { inBrowser } from 'vitepress'
import { ref, watch } from 'vue'
import { useSidebar, useSidebarControl } from '../composables/useSidebar'

const props = defineProps<{
  open: boolean
}>()

type SidebarItem = DefaultTheme.SidebarItem & { icon: string, items: SidebarItem[], prefix: string }
// TODO Remove useless variaables and code
const { sidebarGroups, hasSidebar } = useSidebar() as unknown as { sidebarGroups: ComputedRef<SidebarItem[]>, hasSidebar: boolean }

// a11y: focus Nav element when menu has opened
const navEl = ref<HTMLElement | null>(null)
const isLocked = useScrollLock(inBrowser ? globalThis.document.body : null)

watch(
  [props, navEl],
  () => {
    if (props.open) {
      isLocked.value = true
      navEl.value?.focus()
    }
    else { isLocked.value = false }
  },
  { immediate: true, flush: 'post' },
)
</script>

<template>
  <aside v-if="hasSidebar" class="VPSidebar raw" scroll-sm of-y-auto border-right bg-neutral-0 :class="{ open }">
    <nav aria-labelledby="sidebar-aria-label" tabindex="-1" pb-40 h-full relative>
      <span id="sidebar-aria-label" sr-only>Sidebar Navigation</span>

      <template v-for="group in sidebarGroups" :key="group.text">
        <!-- <div w-full border-top sticky top-0 bottom--1 z-1 bg-neutral-0 cursor-pointer> -->
        <!-- <div pt-24 pb-16> -->
        <!-- <a :href="withBase(group.link)" :data-index="i" mx--8 px-8 focus-visible="outline-blue bg-blue/6">
              <p v-if="group.prefix" text-16 op50 font-semibold relative text-left>
                {{ group.prefix }}
              </p>
              <div text="24 neutral" flex="~ items-center gap-8">
                <div v-if="group.icon" :class="group.icon" />
                <h3 text-24 font-bold w-max>
                  {{ group.text }}
                </h3>
              </div>
            </a> -->
        <!-- <div
              absolute inset-x-0 bottom--16 h-16 pointer-events-none
              bg-gradient="to-b from-neutral-0 to-transparent"
            /> -->
        <!-- </div> -->
        <!-- </div> -->

        <Accordion.Root type="single" :default-value="(group.items.some(i => i.collapsed || useSidebarControl(computed(() => i)).hasActiveLink)) ? group.text : ''" collapsible>
          <Accordion.Item :value="group.text">
            <Accordion.Header as="div">
              <div flex="~ items-center gap-8" w-full border="1.5 neutral-600" pl-12>
                <span flex-1>{{ group.text }}</span>
                <Accordion.Trigger class="group" border-l="1.5 neutral-600 solid" h-full self-stretch p-12 bg-neutral-400>
                  <div i-nimiq:chevron-down text="10 neutral-900" op70 transition-transform duration-300 rotate="-90 group-data-[state=open]:!0" />
                </Accordion.Trigger>
              </div>
            </Accordion.Header>
            <Accordion.Content class="accordion-content" of-hidden pb-8>
              <ul border-b="1.5 neutral-500">
                <li v-for="item in group.items" :key="item.text">
                  <SidebarItem :item="item" :depth="0" />
                </li>
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </template>
    </nav>
  </aside>
</template>

<style scoped>
aside {
  position: fixed;
  top: var(--vp-layout-top-height, 0px);
  bottom: 0;
  left: 0;
  z-index: var(--vp-z-index-sidebar);
  width: calc(100vw - 64px);
  max-width: 480px;
  opacity: 0;
  overflow-x: hidden;
  overflow-y: auto;
  transform: translateX(-100%);
  transition: opacity 0.5s, transform 0.25s ease;
  overscroll-behavior: contain;
  padding-left: 40px;

  @media (min-width: 960px) {
    margin-top: var(--vp-nav-height);
    width: var(--vp-sidebar-width);
    max-width: 100%;
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }

  @media (min-width: 1440px) {
    padding-left: max(32px, calc((100% - (var(--vp-layout-max-width) - 64px)) / 2));
    width: calc((100% - (var(--vp-layout-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px);
  }

  &.open {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
    transition: opacity 0.25s,
      transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .dark & {
    box-shadow: var(--vp-shadow-1);
  }

}

.accordion-content[data-state="open"] {
  animation: slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1);
}

.accordion-content[data-state="closed"] {
  animation: slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1) reverse;
}

@keyframes slideDown {
  from {
    height: 0;
  }

  to {
    height: var(--radix-collapsible-content-height);
  }
}
</style>
