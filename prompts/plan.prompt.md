# Portfolio Website — Fullstack (Nuxt.js + NestJS + PostgreSQL + Shadcn UI)

## Description
This document contains a guide for building a fullstack portfolio website using:
- **Nuxt.js** as Frontend (SSR/SPA)
- **NestJS** as Backend (REST API)
- **PostgreSQL** as Database
- **Shadcn UI (Tailwind-based)** for interface components

---

## Development Order
1. Frontend (Nuxt.js + Shadcn UI)
2. Backend (NestJS API)
3. Database (PostgreSQL) + Integration

---

## 1. Frontend — Nuxt.js (Initial Step)

### Project Initialization

```bash
npx nuxi@latest init portfolio-frontend
cd portfolio-frontend
npm install
npm run dev
```

---

### Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure Tailwind in the config file and import it into Nuxt.

---

### Shadcn UI Integration (Nuxt)

Shadcn UI is based on Tailwind + Radix.

Install additional dependencies:

```bash
npm install class-variance-authority clsx tailwind-merge lucide-vue-next
```

---

### Basic UI Component

**components/ui/Button.vue**

```vue
<template>
  <button class="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800">
    <slot />
  </button>
</template>
```

---

### Portfolio Page Structure

Create the main page first without backend integration:

- Hero Section
- About Me
- Project List (dummy data)
- Skills
- Contact

Example temporary data:

```vue
<script setup>
const projects = [
  { id: 1, title: 'Project A' },
  { id: 2, title: 'Project B' }
]
</script>
```

---