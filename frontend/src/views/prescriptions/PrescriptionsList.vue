<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'
import { useConfirm } from '../../composables/useConfirm.js'

const { show } = useToast()
const { confirm } = useConfirm()

const prescriptions = ref([])
const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return prescriptions.value
  return prescriptions.value.filter(p =>
    p.patient_name?.toLowerCase().includes(q) ||
    p.doctor_name?.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  try {
    const res = await axios.get('prescriptions/')
    prescriptions.value = res.data
  } catch {
    show('Erro ao carregar receitas.', 'error')
  }
})

async function remove(id) {
  const ok = await confirm('Excluir esta receita?')
  if (!ok) return
  try {
    await axios.delete(`prescriptions/${id}/`)
    prescriptions.value = prescriptions.value.filter(p => p.id !== id)
    show('Receita excluída com sucesso.')
  } catch {
    show('Erro ao excluir receita.', 'error')
  }
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

  <div class="toolbar">
    <input
      v-model="search"
      type="text"
      class="search-input"
      placeholder="Buscar por paciente ou médico..."
    />
  </div>

  <div class="table-card">
    <table>
      <thead>
        <tr><th>#</th><th>Paciente</th><th>Médico</th><th>Emitida em</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="p in filtered" :key="p.id">
          <td class="td-mono">{{ p.id }}</td>
          <td><RouterLink :to="`/prescriptions/${p.id}`">{{ p.patient_name }}</RouterLink></td>
          <td class="td-muted">{{ p.doctor_name }}</td>
          <td class="td-muted">{{ p.issue_date }}</td>
          <td>
            <div class="actions">
              <RouterLink :to="`/prescriptions/${p.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(p.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="filtered.length === 0" class="empty-row">
          <td colspan="5">{{ search ? 'Nenhum resultado encontrado.' : 'Nenhuma receita cadastrada.' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
