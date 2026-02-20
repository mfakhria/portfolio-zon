<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 pointer-events-none">
    <div class="flex items-center justify-center px-4 pt-4">
      <!-- Floating pill navbar -->
      <nav
        class="pointer-events-auto flex items-center gap-1 rounded-full border border-primary/30 bg-background/80 px-2 py-2 shadow-lg shadow-primary/5 backdrop-blur-xl retro-box-glow"
      >
        <!-- Desktop links -->
        <div class="hidden md:flex items-center gap-1">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="rounded-full px-4 py-1.5 text-xs font-retro text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:retro-glow"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Mobile hamburger -->
        <button
          class="inline-flex md:hidden items-center justify-center rounded-full h-8 w-8 text-foreground hover:bg-accent transition-colors"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          aria-label="Toggle menu"
        >
          <X v-if="isMobileMenuOpen" class="h-4 w-4" />
          <Menu v-else class="h-4 w-4" />
        </button>


      </nav>
    </div>

    <!-- Mobile dropdown -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-95"
    >
      <div
        v-if="isMobileMenuOpen"
        class="pointer-events-auto md:hidden flex justify-center px-4 pt-2"
      >
        <div class="w-full max-w-xs rounded-2xl border border-border/50 bg-background/60 p-3 shadow-lg shadow-black/20 backdrop-blur-xl space-y-1">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="block rounded-xl px-4 py-2.5 text-xs font-retro text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </Transition>
  </header>
</template>
