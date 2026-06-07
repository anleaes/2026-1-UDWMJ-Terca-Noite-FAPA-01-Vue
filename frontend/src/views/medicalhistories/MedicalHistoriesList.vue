<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const histories = ref([])

onMounted(async () => {
  const res = await axios.get('http://localhost:8000/api/medicalhistories/')
  histories.value = res.data
})

async function remove(id) {
  if (!confirm('Excluir este histórico?')) return
  await axios.delete(`http://localhost:8000/api/medicalhistories/${id}/`)
  histories.value = histories.value.filter(h => h.id !== id)
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Históricos Médicos</h1>
      <div class="subtitle">Registros de históricos médicos</div>
    </div>
    <RouterLink to="/medicalhistories/add" class="btn btn-primary">+ Novo Histórico</RouterLink>
  </div>
  <div class="table-card">
    <table>
      <thead>
        <tr><th>#</th><th>Alergias</th><th>Histórico Familiar</th><th>Nome do Paciente</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="h in histories" :key="h.id">
          <td class="td-mono">{{ h.id }}</td>
          <td class="td-muted">{{ h.allergies?.slice(0,40) }}</td>
          <td class="td-muted">{{ h.family_history?.slice(0,40) }}</td>
          <td class="td-muted">{{ h.patient_name?.slice(0,30) }}</td>
          <td>
            <div class="actions">
              <RouterLink :to="`/medicalhistories/${h.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(h.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="histories.length === 0" class="empty-row">
          <td colspan="5">Nenhum histórico cadastrado.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
