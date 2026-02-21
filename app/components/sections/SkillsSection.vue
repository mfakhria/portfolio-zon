<script setup lang="ts">
import { Monitor, Server, Database, Wrench, Cpu, Brain, type LucideIcon } from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import type { ApiSkillCategory } from '~/composables/usePublicApi'

// Map icon name strings from the API to actual Lucide components
const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Server,
  Database,
  Wrench,
  Cpu,
  Brain,
}

const { fetchSkills, fetchExperiences } = usePublicApi()

const skillCategories = ref<ApiSkillCategory[]>([])
const totalSkills = ref(0)
const totalInternships = ref(0)
const totalCertifications = ref(0)

onMounted(async () => {
  try {
    const [skills, experiences] = await Promise.all([
      fetchSkills(),
      fetchExperiences(),
    ])
    skillCategories.value = skills
    totalSkills.value = skills.reduce((sum, cat) => sum + cat.skills.length, 0)
    totalInternships.value = experiences.filter(e => e.type === 'INTERNSHIP').length
    totalCertifications.value = experiences.filter(e => e.type === 'CERTIFICATION').length
  } catch (e) {
    console.error('Failed to fetch skills:', e)
  }
})

function getIcon(name: string) {
  return iconMap[name] || Cpu
}
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
            <EffectsCountUp :target="totalSkills" :duration="2000" suffix="+" />
          </p>
          <p class="text-xs sm:text-sm text-muted-foreground font-display">Technologies</p>
        </div>
        <div class="rounded-lg border border-primary/20 bg-card p-4 text-center shadow-sm retro-box-glow">
          <p class="text-2xl sm:text-3xl font-bold text-primary retro-glow">
            <EffectsCountUp :target="15" :duration="2000" suffix="+" />
          </p>
          <p class="text-xs sm:text-sm text-muted-foreground font-display">Projects</p>
        </div>
        <div class="rounded-lg border border-primary/20 bg-card p-4 text-center shadow-sm retro-box-glow">
          <p class="text-2xl sm:text-3xl font-bold text-primary retro-glow">
            <EffectsCountUp :target="totalInternships" :duration="2000" suffix="+" />
          </p>
          <p class="text-xs sm:text-sm text-muted-foreground font-display">Internships</p>
        </div>
        <div class="rounded-lg border border-primary/20 bg-card p-4 text-center shadow-sm retro-box-glow">
          <p class="text-2xl sm:text-3xl font-bold text-primary retro-glow">
            <EffectsCountUp :target="totalCertifications" :duration="2500" />
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
            <EffectsGlassIcon :icon="getIcon(category.icon)" :size="40" :color="category.color" />
            <h3 class="text-lg font-semibold">{{ category.name }}</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <Badge v-for="skill in category.skills" :key="skill.id" variant="outline">
              {{ skill.name }}
            </Badge>
          </div>
        </EffectsProfileCard>
      </div>
    </div>
  </section>
</template>
