<script setup lang="ts">
import { Github } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'

const projects = [
  {
    id: 1,
    title: 'New Arsipku',
    description: 'A modern correspondence system for AirNav Indonesia built with NestJS, improving performance, scalability, and maintainability for daily internal and external official communications.',
    tech: ['TypeScript', 'NestJS', 'MySQL', 'REST API'],
    github: 'https://github.com/mfakhria',
    image: '/new-arsipku.png',
  },
  {
    id: 2,
    title: 'NavEvent',
    description: 'A digital platform for efficiency and transparency in managing AirNav Indonesia activities. Enables real-time paperless workflows, accelerated certificate distribution, and real-time dashboards.',
    tech: ['PHP', 'Laravel', 'MySQL', 'CI/CD'],
    github: 'https://github.com/mfakhria/be-navevent',
    image: '/nav-event.png',
  },
  {
    id: 3,
    title: 'HydroEye',
    description: 'An automatic fish seed counting system using YOLOv5, Orange Pi Zero 3, and a static camera, achieving 95–97% detection accuracy with real-time monitoring and Google Sheets export.',
    tech: ['Python', 'YOLOv5', 'Tkinter', 'Machine Learning'],
    github: 'https://github.com/mfakhria/HydroEye',
    image: '/hydro-eye.jpg',
  },
  {
    id: 4,
    title: 'IoT Hydroponic Monitor',
    description: 'An IoT-based website using JavaScript, Firebase, and Next.js to integrate hardware monitoring with a responsive web interface and real-time sensor data display via ESP8266.',
    tech: ['JavaScript', 'Next.js', 'Firebase', 'ESP8266'],
    github: 'https://github.com/mfakhria/monitoring_iot-main',
    image: '/iot-monitoring.png',
  },
]
</script>

<template>
  <section id="projects" class="py-16 sm:py-24 bg-muted/30">
    <div class="container mx-auto px-4 max-w-6xl">
      <h2 class="mb-2 text-2xl font-bold tracking-tight text-center">
        <EffectsGlitchText text="Projects" class="retro-glow" :continuous="false" intensity="low" />
      </h2>
      <p class="mb-12 text-center text-muted-foreground font-display text-lg">
        <EffectsScrambledText text="Some things I've built" :speed="40" />
      </p>

      <EffectsChromaGrid class="grid-cols-1 md:grid-cols-2" v-slot="{ mouse }">
        <EffectsChromaCard
          v-for="project in projects"
          :key="project.id"
          :spotlight-x="mouse.x"
          :spotlight-y="mouse.y"
          class="group overflow-hidden"
        >
          <!-- Project Image / Placeholder -->
          <div class="project-img-wrap aspect-video bg-linear-to-br from-primary/10 to-accent/20 flex items-center justify-center overflow-hidden">
            <img
              v-if="project.image"
              :src="project.image"
              :alt="project.title"
              class="project-img w-full h-full object-cover"
            />
            <span v-else class="text-4xl sm:text-5xl font-retro text-primary/30 group-hover:text-primary/60 transition-colors retro-glow">{{ project.title.charAt(0) }}</span>
          </div>

          <CardHeader>
            <CardTitle class="text-lg sm:text-xl">{{ project.title }}</CardTitle>
            <CardDescription class="text-sm">{{ project.description }}</CardDescription>
          </CardHeader>

          <CardContent>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="tech in project.tech" :key="tech" variant="secondary">
                {{ tech }}
              </Badge>
            </div>
          </CardContent>

          <CardFooter class="gap-2 flex-wrap">
            <Button as="a" :href="project.github" target="_blank" variant="outline" size="sm">
              <Github class="mr-1 h-4 w-4" />
              Code
            </Button>
          </CardFooter>
        </EffectsChromaCard>
      </EffectsChromaGrid>
    </div>
  </section>
</template>

<style scoped>
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

/* On hover glitch: briefly flash natural color then re-apply filter */
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

/* Glitch wrapper */
.project-img-wrap {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

/* Chromatic aberration overlay — cyan bars */
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
    transparent 0%,
    transparent 30%,
    hsl(180 100% 60% / 0.18) 30.5%,
    hsl(180 100% 60% / 0.18) 33%,
    transparent 33.5%,
    transparent 60%,
    hsl(120 100% 50% / 0.14) 60.5%,
    hsl(120 100% 50% / 0.14) 63%,
    transparent 63.5%,
    transparent 100%
  );
}

/* Chromatic aberration overlay — magenta bars */
.project-img-wrap::after {
  background: linear-gradient(
    0deg,
    transparent 0%,
    transparent 45%,
    hsl(300 80% 70% / 0.15) 45.5%,
    hsl(300 80% 70% / 0.15) 48%,
    transparent 48.5%,
    transparent 75%,
    hsl(180 100% 60% / 0.12) 75.5%,
    hsl(180 100% 60% / 0.12) 78%,
    transparent 78.5%,
    transparent 100%
  );
}

/* Trigger glitch on hover */
.project-img-wrap:hover img {
  animation: img-glitch 2s steps(1) infinite;
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
