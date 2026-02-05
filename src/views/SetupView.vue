<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import { useProjectStore } from '../stores/projectStore'

const router = useRouter()
const project = useProjectStore()

const form = reactive({
  projectName: 'Acme App',
  teamSize: 5,
  domain: 'SaaS B2B',
})

function submit() {
  project.initProject({
    projectName: form.projectName.trim() || 'Proyecto',
    teamSize: Math.max(1, Number(form.teamSize) || 1),
    domain: form.domain.trim() || 'Software',
  })
  router.push('/timeline')
}
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">Setup inicial</h1>
      <p class="text-sm text-emerald-100/80">Configurá el contexto del proyecto. Esto alimenta el estado global.</p>
    </header>

    <form class="grid gap-4 rounded-lg border border-emerald-900 bg-emerald-900/20 p-4" @submit.prevent="submit">
      <label class="grid gap-1">
        <span class="text-xs font-medium text-emerald-100/80">Nombre del proyecto</span>
        <input
          v-model="form.projectName"
          class="rounded-md border border-emerald-800 bg-emerald-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        />
      </label>

      <label class="grid gap-1">
        <span class="text-xs font-medium text-emerald-100/80">Tamaño del equipo</span>
        <input
          v-model.number="form.teamSize"
          type="number"
          min="1"
          class="rounded-md border border-emerald-800 bg-emerald-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        />
      </label>

      <label class="grid gap-1">
        <span class="text-xs font-medium text-emerald-100/80">Dominio</span>
        <input
          v-model="form.domain"
          class="rounded-md border border-emerald-800 bg-emerald-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        />
      </label>

      <div class="flex justify-end">
        <button
          type="submit"
          class="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
        >
          Guardar y continuar
        </button>
      </div>
    </form>
  </section>
</template>

