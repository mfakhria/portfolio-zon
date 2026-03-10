<script setup lang="ts">
import { CalendarHeatmap } from 'vue3-calendar-heatmap'
import 'vue3-calendar-heatmap/dist/style.css'

interface ContributionDay {
  date: string
  count: number
  level: number
}

const props = withDefaults(defineProps<{
  username: string
}>(), {
  username: 'ffrfrz'
})

const contributions = ref<ContributionDay[]>([])
const totalContributions = ref(0)
const loading = ref(true)
const error = ref(false)

const endDate = computed(() => new Date())

const rangeColor = [
  'hsl(240 15% 10% / 0.6)',   // empty — matches card bg
  'hsl(180 60% 25%)',          // level 1 — dark cyan
  'hsl(200 80% 45%)',          // level 2 — ocean blue
  'hsl(260 70% 60%)',          // level 3 — purple
  'hsl(300 100% 65%)',         // level 4 — bright magenta
]

async function fetchContributions() {
  loading.value = true
  error.value = false
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(props.username)}?y=last`)
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    contributions.value = data.contributions.map((day: ContributionDay) => ({
      date: day.date,
      count: day.count,
    }))
    totalContributions.value = data.total?.lastYear ?? contributions.value.reduce((s: number, d: ContributionDay) => s + d.count, 0)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchContributions)
</script>

<template>
  <div class="github-calendar">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="loading-pulse" />
      <span class="ml-3 text-sm text-muted-foreground font-mono">Loading contributions...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-sm text-muted-foreground font-mono">Failed to load GitHub contributions</p>
    </div>

    <!-- Calendar -->
    <div v-else class="calendar-wrapper">
      <ClientOnly>
        <CalendarHeatmap
          :values="contributions"
          :end-date="endDate"
          :range-color="rangeColor"
          :round="2"
          :max="20"
          dark-mode
          no-data-text="No contributions"
          tooltip-unit="contributions"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.github-calendar {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: hsl(120 60% 25% / 0.4) transparent;
}

.github-calendar::-webkit-scrollbar {
  height: 4px;
}
.github-calendar::-webkit-scrollbar-track {
  background: transparent;
}
.github-calendar::-webkit-scrollbar-thumb {
  background: hsl(120 60% 25% / 0.4);
  border-radius: 4px;
}

.calendar-wrapper {
  min-width: 680px;
}

.calendar-wrapper :deep(svg) {
  width: 100%;
}

.calendar-wrapper :deep(text) {
  fill: hsl(120 40% 55%) !important;
  font-family: var(--font-mono) !important;
  font-size: 10px !important;
}

.calendar-wrapper :deep(rect) {
  rx: 2;
  ry: 2;
}

.loading-pulse {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: hsl(120 100% 65%);
  animation: pulse-glow 1.4s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
</style>
