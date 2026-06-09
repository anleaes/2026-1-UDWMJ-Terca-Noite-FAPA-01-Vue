<script setup>
import { CalendarDays, FlaskConical, FileText, Users, Stethoscope, Tag, Pill, ClipboardList } from 'lucide-vue-next'
</script>

<template>
  <div class="home">
    <div class="home-header">
      <h1>Bem-vindo(a) ao <span>Clínica App</span></h1>
      <p>Selecione uma opção para começar</p>
    </div>

    <p class="home-section-label">Atendimento</p>
    <div class="home-primary-grid">
      <RouterLink to="/consults/add" class="primary-card">
        <CalendarDays :size="36" class="primary-card-icon" />
        <div class="primary-card-title">Nova Consulta</div>
        <div class="primary-card-desc">Agendar e registrar uma consulta médica</div>
      </RouterLink>
      <RouterLink to="/exams/add" class="primary-card">
        <FlaskConical :size="36" class="primary-card-icon" />
        <div class="primary-card-title">Novo Exame</div>
        <div class="primary-card-desc">Solicitar um exame para um paciente</div>
      </RouterLink>
      <RouterLink to="/prescriptions/add" class="primary-card">
        <FileText :size="36" class="primary-card-icon" />
        <div class="primary-card-title">Nova Receita</div>
        <div class="primary-card-desc">Emitir uma receita médica</div>
      </RouterLink>
    </div>

    <p class="home-section-label" style="margin-top: 40px">Cadastros</p>
    <div class="home-secondary-grid">
      <RouterLink to="/patients" class="secondary-card">
        <Users :size="16" class="secondary-card-icon" />
        <span class="secondary-card-title">Pacientes</span>
      </RouterLink>
      <RouterLink to="/doctors" class="secondary-card">
        <Stethoscope :size="16" class="secondary-card-icon" />
        <span class="secondary-card-title">Médicos</span>
      </RouterLink>
      <RouterLink to="/cids" class="secondary-card">
        <Tag :size="16" class="secondary-card-icon" />
        <span class="secondary-card-title">CIDs</span>
      </RouterLink>
      <RouterLink to="/medications" class="secondary-card">
        <Pill :size="16" class="secondary-card-icon" />
        <span class="secondary-card-title">Medicamentos</span>
      </RouterLink>
      <RouterLink to="/medicalhistories" class="secondary-card">
        <ClipboardList :size="16" class="secondary-card-icon" />
        <span class="secondary-card-title">Históricos</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 8px 0;
}

.home-header {
  margin-bottom: 36px;
}

.home-header h1 {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: var(--text);
}

.home-header h1 span {
  color: var(--accent);
}

.home-header p {
  font-size: 14px;
  color: var(--text2);
  margin-top: 6px;
}

.home-section-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text3);
  margin-bottom: 14px;
}

/* Cards primários */
.home-primary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.primary-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 28px 24px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s;
  cursor: pointer;
}

.primary-card:hover {
  border-color: var(--accent);
  background: rgba(79, 142, 247, 0.06);
  transform: translateY(-2px);
}

.primary-card-icon {
  color: var(--accent);
}

.primary-card-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text);
}

.primary-card-desc {
  font-size: 13px;
  color: var(--text2);
  line-height: 1.5;
}

/* Cards secundários */
.home-secondary-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.secondary-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 20px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s;
}

.secondary-card:hover {
  border-color: var(--accent);
  background: var(--surface2);
}

.secondary-card-icon {
  color: var(--text2);
}

.secondary-card-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}
</style>
