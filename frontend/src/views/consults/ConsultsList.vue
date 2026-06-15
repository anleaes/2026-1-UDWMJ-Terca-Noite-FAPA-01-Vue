<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'
import { useConfirm } from '../../composables/useConfirm.js'
import StatusSelect from '../../components/StatusSelect.vue'

const { show } = useToast()
const { confirm } = useConfirm()

const consults = ref([])
const search = ref('')
const filterStatus = ref('')
const filterDoctor = ref('')

const statusOptions = [
  { value: 'AG', label: 'Agendada',        colorClass: 'color-blue' },
  { value: 'AT', label: 'Em Atendimento',  colorClass: 'color-yellow' },
  { value: 'CO', label: 'Concluída',       colorClass: 'color-green' },
  { value: 'CA', label: 'Cancelada',       colorClass: 'color-red' },
]

const uniqueDoctors = computed(() => {
  const names = [...new Set(consults.value.map(c => c.doctor_name).filter(Boolean))]
  return names.sort()
})

const filtered = computed(() => {
  let list = consults.value

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(c =>
      c.patient_name?.toLowerCase().includes(q) ||
      c.doctor_name?.toLowerCase().includes(q)
    )
  }

  if (filterStatus.value) {
    list = list.filter(c => c.status === filterStatus.value)
  }

  if (filterDoctor.value) {
    list = list.filter(c => c.doctor_name === filterDoctor.value)
  }

  return list
})

const hasFilters = computed(() =>
  search.value || filterStatus.value || filterDoctor.value
)

function clearFilters() {
  search.value = ''
  filterStatus.value = ''
  filterDoctor.value = ''
}

function formatDate(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleString('pt-BR')
}

onMounted(async () => {
  try {
    const res = await axios.get('consults/')
    consults.value = res.data
  } catch {
    show('Erro ao carregar consultas.', 'error')
  }
})

async function updateStatus(consult, newStatus) {
  const old = consult.status
  consult.status = newStatus
  try {
    await axios.patch(`consults/${consult.id}/`, { status: newStatus })
    show('Status atualizado.')
  } catch {
    consult.status = old
    show('Erro ao atualizar status.', 'error')
  }
}

async function remove(id) {
  const ok = await confirm('Excluir esta consulta?')
  if (!ok) return
  try {
    await axios.delete(`consults/${id}/`)
    consults.value = consults.value.filter(c => c.id !== id)
    show('Consulta excluída com sucesso.')
  } catch {
    show('Erro ao excluir consulta.', 'error')
  }
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Consultas</h1>
      <div class="subtitle">Lista de consultas agendadas e realizadas</div>
    </div>
    <RouterLink to="/consults/add" class="btn btn-primary">+ Nova Consulta</RouterLink>
  </div>

  <div class="toolbar toolbar-multi">
    <input
      v-model="search"
      type="text"
      class="search-input"
      placeholder="Buscar por paciente ou médico..."
    />
    <select v-model="filterStatus" class="filter-select">
      <option value="">Todos os status</option>
      <option v-for="o in statusOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <select v-model="filterDoctor" class="filter-select">
      <option value="">Todos os médicos</option>
      <option v-for="d in uniqueDoctors" :key="d" :value="d">{{ d }}</option>
    </select>
    <button v-if="hasFilters" class="btn btn-ghost btn-sm" @click="clearFilters">
      Limpar filtros
    </button>
  </div>

  <div class="table-card">
    <table>
      <thead>
        <tr><th>#</th><th>Paciente</th><th>Médico</th><th>Data/Hora</th><th>Status</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="c in filtered" :key="c.id">
          <td class="td-mono">{{ c.id }}</td>
          <td><RouterLink :to="`/consults/${c.id}`">{{ c.patient_name }}</RouterLink></td>
          <td class="td-muted">{{ c.doctor_name }}</td>
          <td class="td-muted">{{ formatDate(c.appointment_date) }}</td>
          <td>
            <StatusSelect
              :model-value="c.status"
              :options="statusOptions"
              @update:model-value="updateStatus(c, $event)"
            />
          </td>
          <td>
            <div class="actions">
              <RouterLink :to="`/consults/${c.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(c.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="filtered.length === 0" class="empty-row">
          <td colspan="6">{{ hasFilters ? 'Nenhum resultado para os filtros aplicados.' : 'Nenhuma consulta cadastrada.' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.toolbar-multi {
  flex-wrap: wrap;
}

.filter-select {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px 12px;
  font-family: var(--font);
  font-size: 13px;
  color: var(--text);
  outline: none;
  transition: border 0.15s;
  cursor: pointer;
  min-width: 140px;
}

.filter-select:focus {
  border-color: var(--accent);
}
</style>
