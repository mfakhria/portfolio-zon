<script setup lang="ts">
import { Code2, GraduationCap, Briefcase } from 'lucide-vue-next'
import { Separator } from '~/components/ui/separator'
</script>

<template>
  <section id="about" class="py-16 sm:py-24">
    <div class="container mx-auto px-4 max-w-6xl">
      <h2 class="mb-2 text-2xl font-bold tracking-tight text-center">
        <EffectsGlitchText text="About Me" class="retro-glow" :continuous="false" intensity="low" />
      </h2>
      <p class="mb-12 text-center text-muted-foreground font-display text-lg">
        <EffectsScrambledText text="Get to know me better" :speed="40" />
      </p>

      <div class="grid gap-8 sm:gap-12 md:grid-cols-2">
        <!-- Bio with ProfileCard 3D tilt -->
        <EffectsProfileCard class="p-6 sm:p-8">
          <div class="space-y-4">
            <EffectsScrollReveal
              text="> I am a fresh graduate of the Computer Engineering Technology Program at IPB Vocational School with a strong interest in Backend Development, IT systems, and web technologies. I have experience in backend system development, API design, database management, and IoT-based solutions."
              class="text-base sm:text-lg leading-relaxed text-muted-foreground"
            />
            <EffectsScrollReveal
              text="I am accustomed to working in project-based environments, providing technical support, and collaborating effectively to solve problems in a structured manner. I am a disciplined and results-oriented individual with a strong commitment to continuous learning."
              class="text-base sm:text-lg leading-relaxed text-muted-foreground"
            />
          </div>
        </EffectsProfileCard>

        <!-- Quick Facts with GlassIcons -->
        <div class="space-y-6">
          <div class="flex items-start gap-4">
            <EffectsGlassIcon :icon="Code2" :size="48" color="rgba(59, 130, 246, 0.1)" />
            <div>
              <h3 class="font-semibold">
                <EffectsCountUp :target="3" :duration="2000" suffix="+ Internship Experiences" />
              </h3>
              <p class="text-sm text-muted-foreground">AirNav Indonesia, DKP3 Sukabumi, Joglo Kebun Wangi</p>
            </div>
          </div>

          <Separator />

          <div class="flex items-start gap-4">
            <EffectsGlassIcon :icon="GraduationCap" :size="48" color="rgba(139, 92, 246, 0.1)" />
            <div>
              <h3 class="font-semibold">Computer Engineering Technology</h3>
              <p class="text-sm text-muted-foreground">Institut Pertanian Bogor — GPA 3.48/4.00</p>
            </div>
          </div>

          <Separator />

          <div class="flex items-start gap-4">
            <EffectsGlassIcon :icon="Briefcase" :size="48" color="rgba(16, 185, 129, 0.1)" />
            <div>
              <h3 class="font-semibold">BNSP Certified</h3>
              <p class="text-sm text-muted-foreground">Software Engineering & Hardware Installation Supervisor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
