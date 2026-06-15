<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'
import { useConfirm } from '../../composables/useConfirm.js'
import StatusSelect from '../../components/StatusSelect.vue'

const { show } = useToast()
const { confirm } = useConfirm()

const exams = ref([])
const search = ref('')

const statusOptions = [
  { value: 'SO', label: 'Solicitado',    colorClass: 'color-blue' },
  { value: 'AT', label: 'Em Andamento',  colorClass: 'color-yellow' },
  { value: 'CO', label: 'Concluído',     colorClass: 'color-green' },
  { value: 'CA', label: 'Cancelado',     colorClass: 'color-red' },
]

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return exams.value
  return exams.value.filter(e =>
    e.exam_type?.toLowerCase().includes(q) ||
    String(e.consult).includes(q) ||
    statusOptions.find(o => o.value === e.status)?.label.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  try {
    const res = await axios.get('exams/')
    exams.value = res.data
  } catch {
    show('Erro ao carregar exames.', 'error')
  }
})

async function updateStatus(exam, newStatus) {
  const old = exam.status
  exam.status = newStatus
  try {
    await axios.patch(`exams/${exam.id}/`, { status: newStatus })
    show('Status atualizado.')
  } catch {
    exam.status = old
    show('Erro ao atualizar status.', 'error')
  }
}

async function remove(id) {
  const ok = await confirm('Excluir este exame?')
  if (!ok) return
  try {
    await axios.delete(`exams/${id}/`)
    exams.value = exams.value.filter(e => e.id !== id)
    show('Exame excluído com sucesso.')
  } catch {
    show('Erro ao excluir exame.', 'error')
  }
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

  <div class="toolbar">
    <input
      v-model="search"
      type="text"
      class="search-input"
      placeholder="Buscar por tipo de exame ou status..."
    />
  </div>

  <div class="table-card">
    <table>
      <thead>
        <tr><th>Consulta</th><th>Tipo</th><th>Status</th><th>Solicitado em</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="e in filtered" :key="e.id">
          <td class="td-muted">#{{ e.consult }}</td>
          <td>{{ e.exam_type }}</td>
          <td>
            <StatusSelect
              :model-value="e.status"
              :options="statusOptions"
              @update:model-value="updateStatus(e, $event)"
            />
          </td>
          <td class="td-muted">{{ e.request_date }}</td>
          <td>
            <div class="actions">
              <RouterLink :to="`/exams/${e.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(e.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="filtered.length === 0" class="empty-row">
          <td colspan="5">{{ search ? 'Nenhum resultado encontrado.' : 'Nenhum exame cadastrado.' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
