<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'

const { show } = useToast()
const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ patient: '', doctor: '', appointment_date: '', status: 'AG', cid: [], anamnesis: '' })
const exame = ref('N')
const cidOpen = ref(false)
const cidSearch = ref('')
const patients = ref([])
const doctors = ref([])
const cids = ref([])

// filtro de CIDs 
const filteredCids = computed(() => {
  const q = cidSearch.value.trim().toLowerCase()
  if (!q) return cids.value
  return cids.value.filter(c =>
    (c.name ?? '').toLowerCase().includes(q) ||
    (c.description ?? '').toLowerCase().includes(q)
  )
})

// carrega pacientes medicos e cids
onMounted(async () => {
  try {
    const [rp, rd, rc] = await Promise.all([
      axios.get('patients/'),
      axios.get('doctors/'),
      axios.get('cids/'),
    ])
    patients.value = rp.data
    doctors.value = rd.data
    cids.value = rc.data
    if (id) {
      const r = await axios.get(`consults/${id}/`)
      form.value = { ...r.data, appointment_date: r.data.appointment_date?.slice(0, 16) ?? '' }
    }
  } catch {
    show('Erro ao carregar dados.', 'error')
  }
})

// salva a consulta dependendo se tem id na URL
async function save() {
  try {
    if (id) {
      await axios.put(`consults/${id}/`, form.value)
      show('Consulta atualizada com sucesso.')
      router.push('/consults')
    } else {
      await axios.post('consults/', form.value)
      show('Consulta criada com sucesso.')
      // se o usuário marcou que quer cadastrar exame, redireciona direto para a tela de exames
      router.push(exame.value === 'S' ? '/exams/add' : '/consults')
    }
  } catch {
    show('Erro ao salvar consulta.', 'error')
  }
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>{{ id ? 'Editar Consulta' : 'Nova Consulta' }}</h1>
      <div class="subtitle">Agendamento e registro de consulta</div>
    </div>
    <RouterLink to="/consults" class="btn btn-ghost">← Voltar</RouterLink>
  </div>
  <div class="form-card">
    <form @submit.prevent="save">
      <div class="form-grid">
        <div class="form-group">
          <label>Paciente</label>
          <select v-model="form.patient" required>
            <option value="">---------</option>
            <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Médico</label>
          <select v-model="form.doctor" required>
            <option value="">---------</option>
            <option v-for="d in doctors" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Data/Hora</label>
          <input type="datetime-local" v-model="form.appointment_date" required />
        </div>
        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status">
            <option value="AG">Agendada</option>
            <option value="AT">Em Atendimento</option>
            <option value="CO">Concluída</option>
            <option value="CA">Cancelada</option>
          </select>
        </div>
        <div class="form-group full">
          <label>CIDs</label>
          <div class="cid-selector">
            <button type="button" @click="cidOpen = !cidOpen" class="cid-toggle">
              <span class="cid-arrow" :class="{ open: cidOpen }">▶</span>
              {{ form.cid.length ? `${form.cid.length} selecionado(s)` : 'Selecionar CIDs' }}
            </button>
            <div v-if="cidOpen" class="cid-panel">
              <div class="cid-search">
                <input
                  v-model="cidSearch"
                  type="text"
                  placeholder="Buscar por código ou doença..."
                  class="cid-search-input"
                  @click.stop
                />
              </div>
              <div class="cid-list">
                <label v-for="c in filteredCids" :key="c.id" class="cid-option">
                  <input type="checkbox" :value="c.id" v-model="form.cid" />
                  {{ c.name }} - {{ c.description }}
                </label>
                <span v-if="filteredCids.length === 0" class="cid-empty">Nenhum CID encontrado.</span>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group full">
          <label>Anamnese</label>
          <textarea v-model="form.anamnesis"></textarea>
        </div>
      </div>
      <div v-if="!id" class="form-grid" style="margin-top:16px">
        <div class="form-group">
          <label>Exame?</label>
          <select v-model="exame">
            <option value="N">Não</option>
            <option value="S">Sim</option>
          </select>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" @click="router.back()">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.cid-selector {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface2);
}

.cid-toggle {
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  color: var(--text);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cid-arrow {
  font-size: 10px;
  transition: transform 0.2s;
}

.cid-arrow.open {
  transform: rotate(90deg);
}

.cid-panel {
  border-top: 1px solid var(--border);
}

.cid-search {
  padding: 8px 12px;
}

.cid-search-input {
  width: 100%;
  padding: 8px 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
}

.cid-list {
  padding: 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
}

.cid-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: normal;
}

.cid-option input[type="checkbox"] {
  width: auto;
}

.cid-empty {
  font-size: 13px;
  color: var(--text3);
  padding: 8px 0;
}
</style>
