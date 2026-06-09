<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const isActive = (path) => route.path.startsWith(path)
</script>

<template>
  <aside class="sidebar">
    <div class="logo">Clínica<span>App</span></div>

    <span class="nav-section">Cadastros</span>
    <RouterLink to="/cids" :class="['nav-item', { active: isActive('/cids') }]">🏷 CIDs</RouterLink>
    <RouterLink to="/medications" :class="['nav-item', { active: isActive('/medications') }]">💊 Medicamentos</RouterLink>
    <RouterLink to="/medicalhistories" :class="['nav-item', { active: isActive('/medicalhistories') }]">📋 Históricos</RouterLink>

    <span class="nav-section">Pessoas</span>
    <RouterLink to="/patients" :class="['nav-item', { active: isActive('/patients') }]">🧑 Pacientes</RouterLink>
    <RouterLink to="/doctors" :class="['nav-item', { active: isActive('/doctors') }]">🩺 Médicos</RouterLink>

    <span class="nav-section">Atendimento</span>
    <RouterLink to="/consults" :class="['nav-item', { active: isActive('/consults') }]">📅 Consultas</RouterLink>
    <RouterLink to="/exams" :class="['nav-item', { active: isActive('/exams') }]">🔬 Exames</RouterLink>
    <RouterLink to="/prescriptions" :class="['nav-item', { active: isActive('/prescriptions') }]">📝 Receitas</RouterLink>
  </aside>

  <main class="main">
    <RouterView />
  </main>
</template>
