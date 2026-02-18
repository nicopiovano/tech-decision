<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100">
    <header class="border-b border-zinc-800 bg-zinc-950/70 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div class="flex items-baseline gap-3">
          <RouterLink to="/intro" class="text-sm font-semibold tracking-wide">
            Tech Decision Simulator
          </RouterLink>
          <!-- <span class="text-xs text-zinc-400">frontend-only · data-driven</span> -->
        </div>

        <nav class="flex items-center gap-3 text-sm">
          <RouterLink
            to="/timeline"
            class="rounded px-2 py-1 text-zinc-300 hover:bg-zinc-900 hover:text-white"
            :class="{ 'bg-zinc-900 text-white': route.path.startsWith('/timeline') }"
          >
            Timeline
          </RouterLink>
          <RouterLink
            to="/post-mortem"
            class="rounded px-2 py-1 text-zinc-300 hover:bg-zinc-900 hover:text-white"
            :class="{ 'bg-zinc-900 text-white': route.path.startsWith('/post-mortem') }"
          >
            Post‑mortem
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-5xl px-4 pt-8 pb-24">
      <RouterView />
    </main>

    <!-- Firma / stack -->
    <div class="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-4">
      <div class="pointer-events-auto max-w-xl rounded-2xl border border-white/10 bg-zinc-900/70 px-3 py-2 text-xs text-zinc-100 shadow-sm backdrop-blur">
        <span class="font-medium">Desarrollado con</span>
        <span class="mx-2 text-zinc-300">
          Vue · Tailwind · Pinia · Chart.js · AI
        </span>
        <a
          href="https://nico-piovano-porfolio.vercel.app/es"
          target="_blank"
          rel="noopener noreferrer"
          class="underline underline-offset-2 hover:opacity-80"
        >
          <span class="font-medium">by Nico Piovano</span>
        </a>
      </div>
    </div>
  </div>
</template>

