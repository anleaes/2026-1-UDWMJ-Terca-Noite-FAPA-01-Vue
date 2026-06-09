<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'
import { useConfirm } from '../../composables/useConfirm.js'

const { show } = useToast()
const { confirm } = useConfirm()

const doctors = ref([])
const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return doctors.value
  return doctors.value.filter(d =>
    d.name?.toLowerCase().includes(q) ||
    d.crm?.toLowerCase().includes(q) ||
    d.specialty?.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  const res = await axios.get('http://localhost:8000/api/doctors/')
  doctors.value = res.data
})

async function remove(id) {
  const ok = await confirm('Excluir este médico?')
  if (!ok) return
  try {
    await axios.delete(`http://localhost:8000/api/doctors/${id}/`)
    doctors.value = doctors.value.filter(d => d.id !== id)
    show('Médico excluído com sucesso.')
  } catch {
    show('Erro ao excluir médico.', 'error')
  }
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

  <div class="toolbar">
    <input
      v-model="search"
      type="text"
      class="search-input"
      placeholder="Buscar por nome, CRM ou especialidade..."
    />
  </div>

  <div class="table-card">
    <table>
      <thead>
        <tr><th>Nome</th><th>CRM</th><th>Especialidade</th><th>E-mail</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="d in filtered" :key="d.id">
          <td><RouterLink :to="`/doctors/${d.id}`">{{ d.name }}</RouterLink></td>
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
        <tr v-if="filtered.length === 0" class="empty-row">
          <td colspan="5">{{ search ? 'Nenhum resultado encontrado.' : 'Nenhum médico cadastrado.' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
