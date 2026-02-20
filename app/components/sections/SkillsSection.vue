<script setup lang="ts">
import { Monitor, Server, Database, Wrench, Cpu, Brain } from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'

interface SkillCategory {
  name: string
  icon: any
  color: string
  skills: string[]
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    icon: Monitor,
    color: 'rgba(59, 130, 246, 0.1)',
    skills: ['Vue.js', 'Nuxt.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    name: 'Backend',
    icon: Server,
    color: 'rgba(16, 185, 129, 0.1)',
    skills: ['NestJS', 'Node.js', 'Express', 'Python', 'REST API', 'GraphQL'],
  },
  {
    name: 'Database',
    icon: Database,
    color: 'rgba(245, 158, 11, 0.1)',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Prisma', 'TypeORM'],
  },
  {
    name: 'IoT & Embedded',
    icon: Cpu,
    color: 'rgba(239, 68, 68, 0.1)',
    skills: ['ESP8266', 'Orange Pi', 'Arduino', 'Sensor Integration', 'MQTT'],
  },
  {
    name: 'AI & ML',
    icon: Brain,
    color: 'rgba(168, 85, 247, 0.1)',
    skills: ['YOLOv5', 'Machine Learning', 'Computer Vision', 'Python ML'],
  },
  {
    name: 'DevOps & Tools',
    icon: Wrench,
    color: 'rgba(139, 92, 246, 0.1)',
    skills: ['Git', 'Docker', 'CI/CD', 'Linux', 'Nginx', 'Vercel'],
  },
]
</script>

<template>
  <section id="skills" class="py-16 sm:py-24">
    <div class="container mx-auto px-4 max-w-6xl">
      <h2 class="mb-2 text-2xl font-bold tracking-tight text-center">
        <EffectsGlitchText text="Skills" class="retro-glow" :continuous="false" intensity="low" />
      </h2>
      <p class="mb-12 text-center text-muted-foreground font-display text-lg">
        <EffectsScrambledText text="Technologies I work with" :speed="40" />
      </p>

      <!-- Stats row -->
      <div class="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="rounded-lg border border-primary/20 bg-card p-4 text-center shadow-sm retro-box-glow">
          <p class="text-2xl sm:text-3xl font-bold text-primary retro-glow">
            <EffectsCountUp :target="30" :duration="2000" suffix="+" />
          </p>
          <p class="text-xs sm:text-sm text-muted-foreground font-display">Technologies</p>
        </div>
        <div class="rounded-lg border border-primary/20 bg-card p-4 text-center shadow-sm retro-box-glow">
          <p class="text-2xl sm:text-3xl font-bold text-primary retro-glow">
            <EffectsCountUp :target="4" :duration="2000" suffix="+" />
          </p>
          <p class="text-xs sm:text-sm text-muted-foreground font-display">Projects</p>
        </div>
        <div class="rounded-lg border border-primary/20 bg-card p-4 text-center shadow-sm retro-box-glow">
          <p class="text-2xl sm:text-3xl font-bold text-primary retro-glow">
            <EffectsCountUp :target="3" :duration="2000" suffix="+" />
          </p>
          <p class="text-xs sm:text-sm text-muted-foreground font-display">Internships</p>
        </div>
        <div class="rounded-lg border border-primary/20 bg-card p-4 text-center shadow-sm retro-box-glow">
          <p class="text-2xl sm:text-3xl font-bold text-primary retro-glow">
            <EffectsCountUp :target="2" :duration="2500" />
          </p>
          <p class="text-xs sm:text-sm text-muted-foreground font-display">BNSP Certifications</p>
        </div>
      </div>

      <div class="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <EffectsProfileCard
          v-for="category in skillCategories"
          :key="category.name"
          class="p-5 sm:p-6"
        >
          <div class="mb-4 flex items-center gap-3">
            <EffectsGlassIcon :icon="category.icon" :size="40" :color="category.color" />
            <h3 class="text-lg font-semibold">{{ category.name }}</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <Badge v-for="skill in category.skills" :key="skill" variant="outline">
              {{ skill }}
            </Badge>
          </div>
        </EffectsProfileCard>
      </div>
    </div>
  </section>
</template>
