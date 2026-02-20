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
    tech: ['NestJS', 'PostgreSQL', 'REST API', 'TypeScript'],
    github: 'https://github.com/mfakhria',
  },
  {
    id: 2,
    title: 'NavEvent',
    description: 'A digital platform for efficiency and transparency in managing AirNav Indonesia activities. Enables real-time paperless workflows, accelerated certificate distribution, and real-time dashboards.',
    tech: ['NestJS', 'Vue.js', 'PostgreSQL', 'CI/CD'],
    github: 'https://github.com/mfakhria',
  },
  {
    id: 3,
    title: 'HydroEye',
    description: 'An automatic fish seed counting system using YOLOv5, Orange Pi Zero 3, and a static camera, achieving 95–97% detection accuracy with real-time monitoring and Google Sheets export.',
    tech: ['Python', 'YOLOv5', 'Tkinter', 'Machine Learning'],
    github: 'https://github.com/mfakhria',
  },
  {
    id: 4,
    title: 'IoT Hydroponic Monitor',
    description: 'An IoT-based website using JavaScript, Firebase, and Next.js to integrate hardware monitoring with a responsive web interface and real-time sensor data display via ESP8266.',
    tech: ['Next.js', 'Firebase', 'JavaScript', 'ESP8266'],
    github: 'https://github.com/mfakhria',
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
          <!-- Placeholder Image -->
          <div class="aspect-video bg-linear-to-br from-primary/10 to-accent/20 flex items-center justify-center">
            <span class="text-4xl sm:text-5xl font-retro text-primary/30 group-hover:text-primary/60 transition-colors retro-glow">{{ project.title.charAt(0) }}</span>
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
