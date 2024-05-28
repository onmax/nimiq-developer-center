<script setup lang="ts">
type Callout = 'warning' | 'tip' | 'info'
const props = withDefaults(defineProps<{ type: Callout, noTitle?: boolean }>(), { noTitle: false })

const classes = computed(() => {
  switch (props.type) {
    case 'warning': {
      return {
        container: 'bg-orange-400 dark:bg-orange-400 text-orange-1100 [--border-color:rgb(var(--nq-orange)/0.1)]',
        icon: 'i-nimiq:alert',
      }
    }
    case 'tip': {
      return {
        container: 'bg-gold-400/50 dark:bg-gold-400 text-gold [--border-color:rgb(var(--nq-gold)/0.1)]',
        icon: 'i-nimiq:bulb',
      }
    }
    case 'info': {
      return {
        container: 'bg-blue-400 text-blue-1100 [--border-color:rgb(var(--nq-blue)/0.15)]',
        icon: 'i-nimiq:info',
      }
    }

    default: return {}
  }
})
</script>

<template>
  <div w-full :class="classes.container" px-24 py-20 rounded-6 my-64 border-base text-pretty class="callout">
    <div v-if="!noTitle" flex="~ gap-8 items-center" mb-12>
      <div :class="classes.icon" op-80 text-14 />
      <h5 label text-current>
        {{ type }}
      </h5>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.callout ::v-deep(a) {
  --uno: underline text-inherit;
}

.callout ::v-deep(code) {
  --uno: text-inherit;
}
</style>
