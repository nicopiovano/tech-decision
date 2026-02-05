<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <header class="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div class="flex items-baseline gap-3">
          <RouterLink to="/intro" class="text-sm font-semibold tracking-wide">
            Tech Decision Simulator
          </RouterLink>
          <span class="text-xs text-slate-400">frontend-only · data-driven</span>
        </div>

        <nav class="flex items-center gap-3 text-sm">
          <RouterLink
            to="/timeline"
            class="rounded px-2 py-1 text-slate-300 hover:bg-slate-900 hover:text-white"
            :class="{ 'bg-slate-900 text-white': route.path.startsWith('/timeline') }"
          >
            Timeline
          </RouterLink>
          <RouterLink
            to="/dashboard"
            class="rounded px-2 py-1 text-slate-300 hover:bg-slate-900 hover:text-white"
            :class="{ 'bg-slate-900 text-white': route.path.startsWith('/dashboard') }"
          >
            Dashboard
          </RouterLink>
          <RouterLink
            to="/post-mortem"
            class="rounded px-2 py-1 text-slate-300 hover:bg-slate-900 hover:text-white"
            :class="{ 'bg-slate-900 text-white': route.path.startsWith('/post-mortem') }"
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

