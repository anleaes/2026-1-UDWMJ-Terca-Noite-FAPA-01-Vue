<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'
import { useConfirm } from '../../composables/useConfirm.js'

const { show } = useToast()
const { confirm } = useConfirm()

const patients = ref([])
const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return patients.value
  return patients.value.filter(p =>
    p.name?.toLowerCase().includes(q) ||
    p.cpf?.toLowerCase().includes(q) ||
    p.health_insurance?.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  try {
    const res = await axios.get('patients/')
    patients.value = res.data
  } catch {
    show('Erro ao carregar pacientes.', 'error')
  }
})

async function remove(id) {
  const ok = await confirm('Excluir este paciente?')
  if (!ok) return
  try {
    await axios.delete(`patients/${id}/`)
    patients.value = patients.value.filter(p => p.id !== id)
    show('Paciente excluído com sucesso.')
  } catch {
    show('Erro ao excluir paciente.', 'error')
  }
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

  <div class="toolbar">
    <input
      v-model="search"
      type="text"
      class="search-input"
      placeholder="Buscar por nome, CPF ou convênio..."
    />
  </div>

  <div class="table-card">
    <table>
      <thead>
        <tr><th>Nome</th><th>CPF</th><th>Convênio</th><th>Contato Emergência</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="p in filtered" :key="p.id">
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
        <tr v-if="filtered.length === 0" class="empty-row">
          <td colspan="5">{{ search ? 'Nenhum resultado encontrado.' : 'Nenhum paciente cadastrado.' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
