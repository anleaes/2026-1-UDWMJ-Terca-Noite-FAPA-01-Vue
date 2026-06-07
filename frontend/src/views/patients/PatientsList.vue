<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const patients = ref([])
const router = useRouter()

onMounted(async () => {
  const res = await axios.get('http://localhost:8000/api/patients/')
  patients.value = res.data
})

async function remove(id) {
  if (!confirm('Excluir este paciente?')) return
  await axios.delete(`http://localhost:8000/api/patients/${id}/`)
  patients.value = patients.value.filter(p => p.id !== id)
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Pacientes</h1>
      <div class="subtitle">Lista de pacientes cadastrados</div>
    </div>
    <RouterLink to="/patients/add" class="btn btn-primary">+ Novo Paciente</RouterLink>
  </div>
  <div class="table-card">
    <table>
      <thead>
        <tr><th>Nome</th><th>CPF</th><th>Convênio</th><th>Contato Emergência</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="p in patients" :key="p.id">
          <td><RouterLink :to="`/patients/${p.id}`">{{ p.name }}</RouterLink></td>
          <td class="td-mono">{{ p.cpf }}</td>
          <td class="td-muted">{{ p.health_insurance }}</td>
          <td class="td-muted">{{ p.emergency_contact }}</td>
          <td>
            <div class="actions">
              <RouterLink :to="`/patients/${p.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(p.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="patients.length === 0" class="empty-row">
          <td colspan="5">Nenhum paciente cadastrado.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
