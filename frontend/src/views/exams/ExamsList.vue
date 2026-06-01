<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const exams = ref([])
const statusLabel = { SO: 'Solicitado', AT: 'Em Andamento', CO: 'Concluído', CA: 'Cancelado' }

onMounted(async () => {
  const res = await axios.get('http://localhost:8000/api/exams/')
  exams.value = res.data
})

async function remove(id) {
  if (!confirm('Excluir este exame?')) return
  await axios.delete(`http://localhost:8000/api/exams/${id}/`)
  exams.value = exams.value.filter(e => e.id !== id)
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Exames</h1>
      <div class="subtitle">Lista de exames solicitados</div>
    </div>
    <RouterLink to="/exams/add" class="btn btn-primary">+ Novo Exame</RouterLink>
  </div>
  <div class="table-card">
    <table>
      <thead>
        <tr><th>Consulta</th><th>Tipo</th><th>Status</th><th>Solicitado em</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="e in exams" :key="e.id">
          <td class="td-muted">#{{ e.consult }}</td>
          <td>{{ e.exam_type }}</td>
          <td><span class="badge badge-blue">{{ statusLabel[e.status] }}</span></td>
          <td class="td-muted">{{ e.request_date }}</td>
          <td>
            <div class="actions">
              <RouterLink :to="`/exams/${e.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(e.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="exams.length === 0" class="empty-row">
          <td colspan="5">Nenhum exame cadastrado.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
