<script setup lang="ts">
import { Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import type { ApiProject } from '~/composables/usePublicApi'

const { fetchProjects } = usePublicApi()
const projects = ref<ApiProject[]>([])

onMounted(async () => {
  try {
    projects.value = await fetchProjects()
  } catch (e) {
    console.error('Failed to fetch projects:', e)
  }
})

// Carousel state
const currentIndex = ref(0)
const perPage = ref(2)
const carouselTrack = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragDelta = ref(0)

const totalPages = computed(() =>
  Math.ceil(projects.value.length / perPage.value)
)

const currentPage = computed(() =>
  Math.floor(currentIndex.value / perPage.value)
)

function goToPage(page: number) {
  currentIndex.value = Math.max(0, Math.min(page * perPage.value, projects.value.length - perPage.value))
}

function prev() {
  const page = Math.max(0, currentPage.value - 1)
  goToPage(page)
}

function next() {
  const page = Math.min(totalPages.value - 1, currentPage.value + 1)
  goToPage(page)
}

// Drag/swipe support
function onDragStart(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  dragDelta.value = 0
  dragStartX.value = 'touches' in e ? (e.touches[0]?.clientX ?? 0) : e.clientX
}

function onDragMove(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return
  const x = 'touches' in e ? (e.touches[0]?.clientX ?? dragStartX.value) : e.clientX
  dragDelta.value = x - dragStartX.value
}

function onDragEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  if (dragDelta.value < -60) next()
  else if (dragDelta.value > 60) prev()
  dragDelta.value = 0
}

// Responsive perPage
onMounted(() => {
  const update = () => { perPage.value = window.innerWidth < 768 ? 1 : 2 }
  update()
  window.addEventListener('resize', update)
  onUnmounted(() => window.removeEventListener('resize', update))
})

const translateX = computed(() => {
  const base = -(currentIndex.value / perPage.value) * 100
  if (isDragging.value && carouselTrack.value) {
    const pct = (dragDelta.value / carouselTrack.value.offsetWidth) * 100
    return base + pct
  }
  return base
})
</script>

<template>
  <section id="projects" class="py-16 sm:py-24">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Heading -->
      <h2 class="mb-2 text-2xl font-bold tracking-tight text-center">
        <EffectsGlitchText text="Projects" class="retro-glow" :continuous="false" intensity="low" />
      </h2>
      <p class="mb-12 text-center text-muted-foreground font-display text-lg">
        <EffectsScrambledText text="Some things I've built" :speed="40" />
      </p>

      <!-- Carousel wrapper -->
      <div class="relative group/carousel">

        <!-- Prev button -->
        <button
          v-if="projects.length > perPage"
          :disabled="currentPage === 0"
          class="carousel-nav carousel-nav-left"
          aria-label="Previous"
          @click="prev"
        >
          <ChevronLeft class="h-5 w-5" />
        </button>

        <!-- Track viewport -->
        <div
          ref="carouselTrack"
          class="overflow-hidden select-none"
          @mousedown="onDragStart"
          @mousemove="onDragMove"
          @mouseup="onDragEnd"
          @mouseleave="onDragEnd"
          @touchstart.passive="onDragStart"
          @touchmove.passive="onDragMove"
          @touchend="onDragEnd"
        >
          <div
            class="flex"
            :class="isDragging ? '' : 'transition-transform duration-500 ease-in-out'"
            :style="{ transform: `translateX(${translateX}%)` }"
          >
            <!-- Each page group -->
            <div
              v-for="(project, i) in projects"
              :key="project.id"
              :style="{ width: `${100 / perPage}%`, flexShrink: 0 }"
              :class="i % perPage === 0 ? 'pl-0' : ''"
              class="px-2"
            >
              <!-- Card -->
              <div class="project-card rounded-xl border border-primary/20 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,255,0,0.07)]">
                <!-- Image -->
                <div class="project-img-wrap aspect-video bg-linear-to-br from-primary/10 to-accent/20 flex items-center justify-center overflow-hidden">
                  <img
                    v-if="project.image"
                    :src="project.image"
                    :alt="project.title"
                    class="project-img w-full h-full object-cover"
                    draggable="false"
                  />
                  <span v-else class="text-5xl font-retro text-primary/30 group-hover:text-primary/60 transition-colors retro-glow">
                    {{ project.title.charAt(0) }}
                  </span>
                </div>

                <!-- Info -->
                <div class="p-5 space-y-3">
                  <div class="flex items-start justify-between gap-2">
                    <h3 class="font-retro text-sm sm:text-base text-primary retro-glow leading-snug">{{ project.title }}</h3>
                    <div class="flex items-center gap-1.5 shrink-0">
                      <a
                        v-if="project.github"
                        :href="project.github"
                        target="_blank"
                        rel="noopener"
                        class="rounded-md border border-primary/20 bg-background/50 p-1.5 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                      >
                        <Github class="h-4 w-4" />
                      </a>
                      <a
                        v-if="project.liveUrl"
                        :href="project.liveUrl"
                        target="_blank"
                        rel="noopener"
                        class="rounded-md border border-primary/20 bg-background/50 p-1.5 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                      >
                        <ExternalLink class="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  <p class="text-xs text-muted-foreground leading-relaxed line-clamp-3 font-mono">{{ project.description }}</p>

                  <div class="flex flex-wrap gap-1.5 pt-1">
                    <Badge v-for="tech in project.tech" :key="tech" variant="secondary" class="text-[10px] px-2 py-0.5">
                      {{ tech }}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Next button -->
        <button
          v-if="projects.length > perPage"
          :disabled="currentPage >= totalPages - 1"
          class="carousel-nav carousel-nav-right"
          aria-label="Next"
          @click="next"
        >
          <ChevronRight class="h-5 w-5" />
        </button>
      </div>

      <!-- Dot indicators -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
        <button
          v-for="page in totalPages"
          :key="page"
          :aria-label="`Go to page ${page}`"
          :class="[
            'rounded-full transition-all duration-300',
            currentPage === page - 1
              ? 'w-6 h-2 bg-primary shadow-[0_0_8px_rgba(0,255,0,0.6)]'
              : 'w-2 h-2 bg-primary/30 hover:bg-primary/60',
          ]"
          @click="goToPage(page - 1)"
        />
      </div>

      <!-- Counter -->
      <p v-if="projects.length > 0" class="text-center text-xs text-muted-foreground font-mono mt-4">
        {{ currentPage * perPage + 1 }}–{{ Math.min((currentPage + 1) * perPage, projects.length) }}
        <span class="text-primary/50">/</span>
        {{ projects.length }} projects
      </p>
    </div>
  </section>
</template>

<style scoped>
/* Nav buttons */
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 1px solid hsla(120, 100%, 65%, 0.3);
  background: hsla(240, 20%, 4%, 0.8);
  color: hsl(120, 100%, 65%);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  backdrop-filter: blur(8px);
}

.carousel-nav:hover:not(:disabled) {
  border-color: hsla(120, 100%, 65%, 0.7);
  box-shadow: 0 0 12px hsla(120, 100%, 65%, 0.3);
}

.carousel-nav:disabled {
  opacity: 0 !important;
  cursor: default;
}

.carousel-nav-left  { left: -1.25rem; }
.carousel-nav-right { right: -1.25rem; }

.group\/carousel:hover .carousel-nav:not(:disabled) {
  opacity: 1;
}

/* Base green retro filter on images */
.project-img {
  filter:
    grayscale(40%)
    sepia(60%)
    hue-rotate(80deg)
    saturate(180%)
    brightness(0.75)
    contrast(1.1);
  transition: filter 0.4s ease;
}

.project-img-wrap:hover .project-img {
  animation: img-glitch 2s steps(1) infinite;
  filter:
    grayscale(10%)
    sepia(30%)
    hue-rotate(80deg)
    saturate(130%)
    brightness(0.85)
    contrast(1.05);
}

.project-img-wrap {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.project-img-wrap::before,
.project-img-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  mix-blend-mode: screen;
  z-index: 2;
}

.project-img-wrap::before {
  background: linear-gradient(
    0deg,
    transparent 0%, transparent 30%,
    hsla(180, 100%, 60%, 0.18) 30.5%, hsla(180, 100%, 60%, 0.18) 33%,
    transparent 33.5%, transparent 60%,
    hsla(120, 100%, 50%, 0.14) 60.5%, hsla(120, 100%, 50%, 0.14) 63%,
    transparent 63.5%, transparent 100%
  );
}

.project-img-wrap::after {
  background: linear-gradient(
    0deg,
    transparent 0%, transparent 45%,
    hsla(300, 80%, 70%, 0.15) 45.5%, hsla(300, 80%, 70%, 0.15) 48%,
    transparent 48.5%, transparent 75%,
    hsla(180, 100%, 60%, 0.12) 75.5%, hsla(180, 100%, 60%, 0.12) 78%,
    transparent 78.5%, transparent 100%
  );
}

.project-img-wrap:hover::before {
  animation: img-overlay-cyan 2s steps(1) infinite;
}

.project-img-wrap:hover::after {
  animation: img-overlay-magenta 2s steps(1) infinite;
}

@keyframes img-glitch {
  0%, 100%  { transform: none; filter: none; clip-path: none; }
  5%        { transform: translateX(-3px) skewX(-1.5deg); filter: hue-rotate(90deg) brightness(1.25); }
  6%        { transform: translateX(4px) skewX(0.5deg); filter: hue-rotate(-90deg) brightness(0.9); }
  7%        { transform: none; filter: none; }
  20%       { transform: none; filter: none; clip-path: none; }
  21%       { transform: translateX(5px) skewX(1.5deg); filter: hue-rotate(180deg) brightness(0.8); clip-path: inset(15% 0 55% 0); }
  22%       { transform: translateX(-4px); filter: hue-rotate(-45deg); clip-path: inset(55% 0 5% 0); }
  23%       { transform: translateX(2px); filter: none; clip-path: none; }
  24%       { transform: none; filter: none; }
  50%       { transform: none; filter: none; }
  51%       { transform: translateX(-6px); filter: hue-rotate(90deg) brightness(1.3); clip-path: inset(25% 0 50% 0); }
  52%       { transform: translateX(6px); filter: hue-rotate(-90deg); clip-path: inset(50% 0 15% 0); }
  53%       { transform: none; filter: none; clip-path: none; }
  80%       { transform: none; filter: none; }
  81%       { transform: translateX(3px) skewX(1deg); filter: hue-rotate(45deg) brightness(1.1); }
  82%       { transform: none; filter: none; }
}

@keyframes img-overlay-cyan {
  0%, 100%  { opacity: 0; transform: translateX(0); }
  5%        { opacity: 1; transform: translateX(-4px); }
  6%        { opacity: 1; transform: translateX(3px); }
  7%        { opacity: 0; }
  21%       { opacity: 0; }
  22%       { opacity: 1; transform: translateX(4px); }
  23%       { opacity: 1; transform: translateX(-2px); }
  24%       { opacity: 0; }
  51%       { opacity: 0; }
  52%       { opacity: 1; transform: translateX(-3px); }
  53%       { opacity: 0; }
}

@keyframes img-overlay-magenta {
  0%, 100%  { opacity: 0; }
  6%        { opacity: 1; transform: translateX(3px); }
  7%        { opacity: 1; transform: translateX(-2px); }
  8%        { opacity: 0; }
  22%       { opacity: 0; }
  23%       { opacity: 1; transform: translateX(-4px); }
  24%       { opacity: 0; }
  52%       { opacity: 0; }
  53%       { opacity: 1; transform: translateX(3px); }
  54%       { opacity: 0; }
  81%       { opacity: 1; transform: translateX(-1px); }
  82%       { opacity: 0; }
}
</style>
