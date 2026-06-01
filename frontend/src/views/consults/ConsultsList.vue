<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const consults = ref([])

const statusLabel = { AG: 'Agendada', AT: 'Em Atendimento', CO: 'Concluída', CA: 'Cancelada' }

onMounted(async () => {
  const res = await axios.get('http://localhost:8000/api/consults/')
  consults.value = res.data
})

async function remove(id) {
  if (!confirm('Excluir esta consulta?')) return
  await axios.delete(`http://localhost:8000/api/consults/${id}/`)
  consults.value = consults.value.filter(c => c.id !== id)
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
          <td>{{ c.patient }}</td>
          <td class="td-muted">{{ c.doctor }}</td>
          <td class="td-muted">{{ formatDate(c.appointment_date) }}</td>
          <td><span class="badge badge-blue">{{ statusLabel[c.status] }}</span></td>
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
