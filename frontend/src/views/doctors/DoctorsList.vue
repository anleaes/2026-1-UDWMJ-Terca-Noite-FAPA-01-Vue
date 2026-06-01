<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const doctors = ref([])

onMounted(async () => {
  const res = await axios.get('http://localhost:8000/api/doctors/')
  doctors.value = res.data
})

async function remove(id) {
  if (!confirm('Excluir este médico?')) return
  await axios.delete(`http://localhost:8000/api/doctors/${id}/`)
  doctors.value = doctors.value.filter(d => d.id !== id)
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Médicos</h1>
      <div class="subtitle">Lista de médicos cadastrados</div>
    </div>
    <RouterLink to="/doctors/add" class="btn btn-primary">+ Novo Médico</RouterLink>
  </div>
  <div class="table-card">
    <table>
      <thead>
        <tr><th>Nome</th><th>CRM</th><th>Especialidade</th><th>E-mail</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="d in doctors" :key="d.id">
          <td>{{ d.name }}</td>
          <td class="td-mono">{{ d.crm }}</td>
          <td class="td-muted">{{ d.specialty }}</td>
          <td class="td-muted">{{ d.email }}</td>
          <td>
            <div class="actions">
              <RouterLink :to="`/doctors/${d.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(d.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="doctors.length === 0" class="empty-row">
          <td colspan="5">Nenhum médico cadastrado.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
