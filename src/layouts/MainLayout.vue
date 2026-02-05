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

    <main class="mx-auto w-full max-w-5xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

