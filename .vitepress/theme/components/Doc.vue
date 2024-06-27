<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import { useData } from '../composables/useData'
import { useSidebar } from '../composables/useSidebar'
import { MarkdownContent } from './MarkdownContent'

const { theme, frontmatter } = useData()

const route = useRoute()
const { hasSidebar, hasAside, leftAside } = useSidebar()

const pageName = computed(() => route.path.replace(/[./]+/g, '_').replace(/_html$/, ''))
</script>

<template>
  <div class="VPDoc" :class="{ 'has-sidebar': hasSidebar, 'has-aside': hasAside }">
    <slot name="doc-top" />
    <div class="container">
      <div v-if="hasAside" class="aside" :class="{ 'left-aside': leftAside }">
        <div class="aside-curtain" />
        <div class="aside-container">
          <div class="aside-content">
            <div flex="~ col 1">
              <DocAside />
            </div>
          </div>
        </div>
      </div>

      <div class="content" w-full>
        <main class="main">
          <MarkdownContent
            :class="[
              frontmatter.layout === 'home' || frontmatter.prose !== false && 'prose children:pb-40 children:md:pb-64 children:mx-auto',
              frontmatter.prose === false ? `px-32 md:px-96 pb-64 md:pb-128` : '',
              pageName,
              theme.externalLinkIcon && 'external-link-icon-enabled',
            ]"
          />
        </main>
        <DocFooter>
          <template #doc-footer-before>
            <slot name="doc-footer-before" />
          </template>
        </DocFooter>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VPDoc {
  padding: 32px 0 96px;
  width: 100%;
}

@media (min-width: 768px) {
  .VPDoc {
    padding: 48px 0 128px;
  }
}

@media (min-width: 960px) {
  .VPDoc {
    padding: 48px 0 0;
  }

  .VPDoc:not(.has-sidebar) .container {
    display: flex;
    justify-content: center;
    max-width: 992px;
  }

  .VPDoc:not(.has-sidebar) .content {
    max-width: 752px;
  }
}

@media (min-width: 1280px) {
  .VPDoc .container {
    display: flex;
    justify-content: center;
  }

  .VPDoc .aside {
    display: block;
  }
}

@media (min-width: 1440px) {
  .VPDoc:not(.has-sidebar) .content {
    max-width: 784px;
  }

  .VPDoc:not(.has-sidebar) .container {
    max-width: 1104px;
  }
}

.container {
  margin: 0 auto;
  width: 100%;
}

.aside {
  position: relative;
  display: none;
  order: 2;
  flex-grow: 1;
  padding-left: 32px;
  width: 100%;
  max-width: 256px;
}

.left-aside {
  order: 1;
  padding-left: unset;
  padding-right: 32px;
}

.aside-container {
  position: fixed;
  top: 0;
  padding-top: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + var(--vp-doc-top-height, 0px) + 48px);
  width: 224px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.aside-container::-webkit-scrollbar {
  display: none;
}

.aside-curtain {
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 224px;
  height: 32px;
  background: linear-gradient(transparent, var(--vp-c-bg) 70%);
}

.aside-content {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - (var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 48px));
  padding-bottom: 32px;
}

@media (min-width: 960px) {
  .content {
    /* padding: 0 32px 128px; */
  }
}

@media (min-width: 1280px) {
  .content {
    order: 1;
  }
}
</style>

<style>
.vp-code-group {
  >.tabs {
    --uno: bg-neutral-300 px-16 pt-16 flex gap-4 shadow-none z-1 pb-4 text-neutral-800;

    label {
      --uno: ghost-btn mx-0 px-12 py-6 border-b-0 after:hidden h-max lh-[1] rounded-full;
    }

    input:focus-visible+label {
      --uno: ring-blue ring-1.5 ring-offset-1;
    }

    input:checked+label {
      --uno: bg-gradient-blue text-white;
    }
  }

  >.blocks>[class*="language"] {
    .lang {
      --uno: op0;
    }

    pre {
      --uno: mt-0 rounded-t-0 pt-16;
    }
  }

}

div[class*="language"]:has(.copy + .lang) {
  --uno: relative text-neutral-900;

  .lang {
    --uno: absolute text-11 text-neutral-800 lh-12 right-6 top-6;
  }

  .copy {
    --uno: absolute bg-neutral-400 op0 size-32 rounded-6 right-20 top-20 flex items-center justify-center gap-8 px-9 inline-block transition-colors duration-150 ease-out;

    &::after {
      content: '';
      --uno: inline-block text-inherit size-14 bg-current i-nimiq:copy;
    }

    &.copied {
      --uno: w-unset bg-green;

      &::after {
        --uno: text-white i-nimiq:check text-12;
      }

      &::before {
        --uno: text-15 font-bold text-white;
        content: 'Copied!';
      }
    }
  }

  &:hover,
  &:has(.copy:focus) {
    .copy {
      --uno: op100;

      &:not(.copied):hover {
        --uno: bg-neutral-0;
      }
    }
  }
}

div[class*="language"] {
  pre {
    margin-bottom: 1.5rem;
    padding: 0;
  }

  code {
    --uno: block p-24;

    .diff {
      --uno: mx--24 px-24 w-[calc(100%+48px)] inline-block;

      &.remove {
        --uno: bg-red/15 text-red children:text-red before:pr-16 before:content-['-'] before:absolute before:left-8;
      }

      &.add {
        --uno: bg-green/20 text-green children:text-green before:pr-16 before:content-['+'] before:absolute before:left-8;
      }
    }
  }

}

.custom-block {
  --uno: my-24 rounded-6 p-24 pb-14 text-16 ring-1.5;

  .custom-block-title {
    --uno: uppercase font-bold tracking-widest text-12 flex items-center relative m-0;

    &::before {
      --uno: absolute content-[''] text-12 left-0;
    }
  }

  &.info {
    --uno: bg-neutral-200 text-neutral-800 ring-neutral/8;

    .custom-block-title {
      --uno: text-neutral-700 pl-20;

      &::before {
        --uno: i-nimiq:info;
      }
    }
  }

  &.details {
    --uno: bg-neutral-200 text-neutral-800 ring-neutral/8;

    .custom-block-title {
      --uno: text-neutral-700 pl-20;

      &::before {
        --uno: i-nimiq:info;
      }
    }
  }

  &.tip {
    --uno: bg-orange-400 text-orange ring-orange/18;

    .custom-block-title {
      --uno: text-orange/70 pl-24;

      &::before {
        --uno: i-nimiq:icons-lg-bulb text-16 top-0;
      }
    }
  }

  &.important {
    --vp-c-important-1: rgb(var(--nq-red));
    --uno: bg-red-400 text-red ring-red/18;

    .custom-block-title {
      --uno: text-red pl-24 flex;

      &::before {
        --uno: i-nimiq:alert text-14;
      }
    }

    :not(.custom-block-title) li::before {
      --uno: bg-red/70;
    }
  }
}
</style>
