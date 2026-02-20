<script setup lang="ts">
import { Github, Linkedin, Mail, Home } from 'lucide-vue-next'
import { markRaw } from 'vue'

const dockItems = [
  { icon: markRaw(Home), label: 'Home', href: '#hero' },
  { icon: markRaw(Github), label: 'GitHub', href: 'https://github.com/mfakhria' },
  { icon: markRaw(Linkedin), label: 'LinkedIn', href: 'https://linkedin.com/in/mfkhria/' },
  { icon: markRaw(Mail), label: 'Email', href: 'mailto:fakhrizon607@gmail.com' },
]
</script>

<template>
  <footer class="border-t border-primary/20 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Dock -->
      <div class="flex justify-center mb-6">
        <EffectsDock :items="dockItems" :magnification="50" :distance="120" />
      </div>

      <div class="flex flex-col items-center justify-center gap-2 text-center">
        <p class="text-xs text-muted-foreground font-mono">
          Built with <span class="text-primary font-medium">Nuxt.js</span>,
          <span class="text-primary font-medium">Tailwind CSS</span> &
          <span class="text-primary font-medium">Shadcn UI</span>
        </p>
        <p class="text-xs text-muted-foreground font-mono">
          &copy; {{ new Date().getFullYear() }} Muhammad Fakhri Alauddin. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
