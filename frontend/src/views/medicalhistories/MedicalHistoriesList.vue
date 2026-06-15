<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'
import { useConfirm } from '../../composables/useConfirm.js'

const { show } = useToast()
const { confirm } = useConfirm()

const histories = ref([])
const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return histories.value
  return histories.value.filter(h =>
    h.patient_name?.toLowerCase().includes(q) ||
    h.allergies?.toLowerCase().includes(q) ||
    h.family_history?.toLowerCase().includes(q)
  )
})

function truncate(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '...' : text
}

onMounted(async () => {
  try {
    const res = await axios.get('medicalhistories/')
    histories.value = res.data
  } catch {
    show('Erro ao carregar históricos.', 'error')
  }
})

async function remove(id) {
  const ok = await confirm('Excluir este histórico?')
  if (!ok) return
  try {
    await axios.delete(`medicalhistories/${id}/`)
    histories.value = histories.value.filter(h => h.id !== id)
    show('Histórico excluído com sucesso.')
  } catch {
    show('Erro ao excluir histórico.', 'error')
  }
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

  <div class="toolbar">
    <input
      v-model="search"
      type="text"
      class="search-input"
      placeholder="Buscar por paciente ou alergias..."
    />
  </div>

  <div class="table-card">
    <table>
      <thead>
        <tr><th>#</th><th>Nome do Paciente</th><th>Alergias</th><th>Histórico Familiar</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="h in filtered" :key="h.id">
          <td class="td-mono">{{ h.id }}</td>
          <td>{{ truncate(h.patient_name, 30) }}</td>
          <td class="td-muted">{{ truncate(h.allergies, 40) }}</td>
          <td class="td-muted">{{ truncate(h.family_history, 40) }}</td>
          <td>
            <div class="actions">
              <RouterLink :to="`/medicalhistories/${h.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(h.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="filtered.length === 0" class="empty-row">
          <td colspan="5">{{ search ? 'Nenhum resultado encontrado.' : 'Nenhum histórico cadastrado.' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
