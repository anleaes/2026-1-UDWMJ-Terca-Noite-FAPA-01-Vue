<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'
import { useConfirm } from '../../composables/useConfirm.js'

const { show } = useToast()
const { confirm } = useConfirm()

const medications = ref([])
const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return medications.value
  return medications.value.filter(m =>
    m.medication?.toLowerCase().includes(q) ||
    m.brand?.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  try {
    const res = await axios.get('medications/')
    medications.value = res.data
  } catch {
    show('Erro ao carregar medicamentos.', 'error')
  }
})

async function remove(id) {
  const ok = await confirm('Excluir este medicamento?')
  if (!ok) return
  try {
    await axios.delete(`medications/${id}/`)
    medications.value = medications.value.filter(m => m.id !== id)
    show('Medicamento excluído com sucesso.')
  } catch {
    show('Erro ao excluir medicamento.', 'error')
  }
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Medicamentos</h1>
      <div class="subtitle">Lista de medicamentos cadastrados</div>
    </div>
    <RouterLink to="/medications/add" class="btn btn-primary">+ Novo Medicamento</RouterLink>
  </div>

  <div class="toolbar">
    <input
      v-model="search"
      type="text"
      class="search-input"
      placeholder="Buscar por medicamento ou marca..."
    />
  </div>

  <div class="table-card">
    <table>
      <thead>
        <tr><th>Medicamento</th><th>Marca</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="m in filtered" :key="m.id">
          <td>{{ m.medication }}</td>
          <td class="td-muted">{{ m.brand }}</td>
          <td>
            <div class="actions">
              <RouterLink :to="`/medications/${m.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(m.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="filtered.length === 0" class="empty-row">
          <td colspan="3">{{ search ? 'Nenhum resultado encontrado.' : 'Nenhum medicamento cadastrado.' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
