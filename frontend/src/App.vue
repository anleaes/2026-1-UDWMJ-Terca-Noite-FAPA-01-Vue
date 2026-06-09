<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Tag, Pill, ClipboardList, Users, Stethoscope, CalendarDays, FlaskConical, FileText } from 'lucide-vue-next'

const route = useRoute()
const isActive = (path) => route.path.startsWith(path)
</script>

<template>
  <aside class="sidebar">
    <RouterLink to="/" class="logo">Clínica<span>App</span></RouterLink>

    <span class="nav-section">Atendimento</span>
    <RouterLink to="/consults" :class="['nav-item', { active: isActive('/consults') }]"><CalendarDays :size="16" /> Consultas</RouterLink>
    <RouterLink to="/exams" :class="['nav-item', { active: isActive('/exams') }]"><FlaskConical :size="16" /> Exames</RouterLink>
    <RouterLink to="/prescriptions" :class="['nav-item', { active: isActive('/prescriptions') }]"><FileText :size="16" /> Receitas</RouterLink>

    <span class="nav-section">Pessoas</span>
    <RouterLink to="/patients" :class="['nav-item', { active: isActive('/patients') }]"><Users :size="16" /> Pacientes</RouterLink>
    <RouterLink to="/doctors" :class="['nav-item', { active: isActive('/doctors') }]"><Stethoscope :size="16" /> Médicos</RouterLink>

    <span class="nav-section">Cadastros</span>
    <RouterLink to="/cids" :class="['nav-item', { active: isActive('/cids') }]"><Tag :size="16" /> CIDs</RouterLink>
    <RouterLink to="/medications" :class="['nav-item', { active: isActive('/medications') }]"><Pill :size="16" /> Medicamentos</RouterLink>
    <RouterLink to="/medicalhistories" :class="['nav-item', { active: isActive('/medicalhistories') }]"><ClipboardList :size="16" /> Históricos</RouterLink>
  </aside>

  <main class="main">
    <RouterView />
  </main>
</template>
