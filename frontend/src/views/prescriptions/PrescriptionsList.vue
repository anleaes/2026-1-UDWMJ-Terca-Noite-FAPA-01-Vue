<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const prescriptions = ref([])

onMounted(async () => {
  const res = await axios.get('http://localhost:8000/api/prescriptions/')
  prescriptions.value = res.data
})

async function remove(id) {
  if (!confirm('Excluir esta receita?')) return
  await axios.delete(`http://localhost:8000/api/prescriptions/${id}/`)
  prescriptions.value = prescriptions.value.filter(p => p.id !== id)
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Receitas</h1>
      <div class="subtitle">Lista de receitas emitidas</div>
    </div>
    <RouterLink to="/prescriptions/add" class="btn btn-primary">+ Nova Receita</RouterLink>
  </div>
  <div class="table-card">
    <table>
      <thead>
        <tr><th>#</th><th>Paciente</th><th>Médico</th><th>Emitida em</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="p in prescriptions" :key="p.id">
          <td class="td-mono">{{ p.id }}</td>
          <td>{{ p.patient }}</td>
          <td class="td-muted">{{ p.doctor }}</td>
          <td class="td-muted">{{ p.issue_date }}</td>
          <td>
            <div class="actions">
              <RouterLink :to="`/prescriptions/${p.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(p.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="prescriptions.length === 0" class="empty-row">
          <td colspan="5">Nenhuma receita cadastrada.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
