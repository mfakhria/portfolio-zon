<script setup lang="ts">
import { Mail, MapPin, Send } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

function handleSubmit() {
  // TODO: Integrate with NestJS backend
  console.log('Form submitted:', form)
  alert('Thank you for your message! I will get back to you soon.')
  form.name = ''
  form.email = ''
  form.message = ''
}
</script>

<template>
  <section id="contact" class="py-16 sm:py-24 bg-muted/30">
    <div class="container mx-auto px-4 max-w-6xl">
      <h2 class="mb-2 text-2xl font-bold tracking-tight text-center">
        <EffectsGlitchText text="Contact" class="retro-glow" :continuous="false" intensity="low" />
      </h2>
      <p class="mb-12 text-center text-muted-foreground font-display text-lg">
        <EffectsScrambledText text="Let's get in touch" :speed="40" />
      </p>

      <div class="grid gap-8 md:grid-cols-2">
        <!-- Contact Info -->
        <div class="space-y-6">
          <div>
            <h3 class="mb-4 text-xl font-semibold">Get in Touch</h3>
            <EffectsScrollReveal
              text="I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out!"
              class="text-muted-foreground leading-relaxed"
            />
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <EffectsGlassIcon :icon="Mail" :size="40" color="rgba(59, 130, 246, 0.1)" />
              <div>
                <p class="text-sm text-muted-foreground">Email</p>
                <p class="font-medium">fakhrizon607@gmail.com</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <EffectsGlassIcon :icon="MapPin" :size="40" color="rgba(16, 185, 129, 0.1)" />
              <div>
                <p class="text-sm text-muted-foreground">Location</p>
                <p class="font-medium">Tangerang, Indonesia</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>Fill out the form and I'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form class="space-y-4" @submit.prevent="handleSubmit">
              <div class="space-y-2">
                <label for="name" class="text-sm font-medium leading-none">Name</label>
                <Input id="name" v-model="form.name" placeholder="Your name" required />
              </div>
              <div class="space-y-2">
                <label for="email" class="text-sm font-medium leading-none">Email</label>
                <Input id="email" v-model="form.email" type="email" placeholder="your@email.com" required />
              </div>
              <div class="space-y-2">
                <label for="message" class="text-sm font-medium leading-none">Message</label>
                <Textarea id="message" v-model="form.message" placeholder="Your message..." class="min-h-30" required />
              </div>
              <Button type="submit" class="w-full">
                <Send class="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
