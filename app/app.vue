<script setup lang="ts">
const isLoading = ref(true)

function onLoadingDone() {
  isLoading.value = false
}
</script>

<template>
  <!-- Loading screen (shown once on first visit) -->
  <EffectsLoadingScreen v-if="isLoading" @done="onLoadingDone" />

  <!-- Main app -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
