<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const consults = ref([])

const statusOptions = [
  { value: 'AG', label: 'Agendada' },
  { value: 'AT', label: 'Em Atendimento' },
  { value: 'CO', label: 'Concluída' },
  { value: 'CA', label: 'Cancelada' },
]

const statusColor = { AG: 'badge-blue', AT: 'badge-yellow', CO: 'badge-green', CA: 'badge-red' }

onMounted(async () => {
  const res = await axios.get('http://localhost:8000/api/consults/')
  consults.value = res.data
})

async function remove(id) {
  if (!confirm('Excluir esta consulta?')) return
  await axios.delete(`http://localhost:8000/api/consults/${id}/`)
  consults.value = consults.value.filter(c => c.id !== id)
}

async function updateStatus(consult, newStatus) {
  const old = consult.status
  consult.status = newStatus
  try {
    await axios.patch(`http://localhost:8000/api/consults/${consult.id}/`, { status: newStatus })
  } catch {
    consult.status = old
  }
}

function formatDate(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleString('pt-BR')
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Consultas</h1>
      <div class="subtitle">Lista de consultas agendadas e realizadas</div>
    </div>
    <RouterLink to="/consults/add" class="btn btn-primary">+ Nova Consulta</RouterLink>
  </div>
  <div class="table-card">
    <table>
      <thead>
        <tr><th>#</th><th>Paciente</th><th>Médico</th><th>Data/Hora</th><th>Status</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="c in consults" :key="c.id">
          <td class="td-mono">{{ c.id }}</td>
          <td><RouterLink :to="`/consults/${c.id}`">{{ c.patient_name }}</RouterLink></td>
          <td class="td-muted">{{ c.doctor_name }}</td>
          <td class="td-muted">{{ formatDate(c.appointment_date) }}</td>
          <td>
            <select
              :value="c.status"
              @change="updateStatus(c, $event.target.value)"
              :class="['status-select', statusColor[c.status]]"
            >
              <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </td>
          <td>
            <div class="actions">
              <RouterLink :to="`/consults/${c.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(c.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="consults.length === 0" class="empty-row">
          <td colspan="6">Nenhuma consulta cadastrada.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.status-select {
  border: none;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  font-family: var(--font);
}
.badge-blue   { background: rgba(79,142,247,0.15);  color: #4f8ef7; }
.badge-yellow { background: rgba(247,169,79,0.15);  color: #f7a94f; }
.badge-green  { background: rgba(56,217,169,0.15);  color: #38d9a9; }
.badge-red    { background: rgba(247,96,79,0.15);   color: #f7604f; }
</style>
