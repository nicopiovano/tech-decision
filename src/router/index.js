import { createRouter, createWebHistory } from 'vue-router'

import IntroView from '../views/IntroView.vue'
import SetupView from '../views/SetupView.vue'
import TimelineView from '../views/TimelineView.vue'
import DecisionView from '../views/DecisionView.vue'
import PostMortemView from '../views/PostMortemView.vue'

/**
 * Router del producto.
 * Mantiene rutas explícitas y predecibles para cada pantalla del simulador.
 */
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/intro' },
    { path: '/intro', name: 'intro', component: IntroView },
    { path: '/setup', name: 'setup', component: SetupView },
    { path: '/timeline', name: 'timeline', component: TimelineView },
    { path: '/decision/:id', name: 'decision', component: DecisionView, props: true },
    { path: '/post-mortem', name: 'post-mortem', component: PostMortemView },
    // Compat: ruta antigua. Si alguien tiene bookmark, no rompe.
    { path: '/dashboard', redirect: '/post-mortem' },
    { path: '/:pathMatch(.*)*', redirect: '/intro' },
  ],
})

