<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ patient: '', doctor: '', appointment_date: '', status: 'AG', cid: [], anamnesis: '' })
const exame = ref('N')
const cidOpen = ref(false)
const patients = ref([])
const doctors = ref([])
const cids = ref([])

onMounted(async () => {
  const [rp, rd, rc] = await Promise.all([
    axios.get('http://localhost:8000/api/patients/'),
    axios.get('http://localhost:8000/api/doctors/'),
    axios.get('http://localhost:8000/api/cids/'),
  ])
  patients.value = rp.data
  doctors.value = rd.data
  cids.value = rc.data
  if (id) {
    const r = await axios.get(`http://localhost:8000/api/consults/${id}/`)
    form.value = { ...r.data, appointment_date: r.data.appointment_date?.slice(0, 16) ?? '' }
  }
})

async function save() {
  if (id) {
    await axios.put(`http://localhost:8000/api/consults/${id}/`, form.value)
    router.push('/consults')
  } else {
    await axios.post('http://localhost:8000/api/consults/', form.value)
    router.push(exame.value === 'S' ? '/exams/add' : '/consults')
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
          <div style="border:1px solid var(--border); border-radius:8px; background:var(--surface2)">
            <button type="button" @click="cidOpen = !cidOpen" style="width:100%; padding:10px 12px; background:none; border:none; color:var(--text); font-size:14px; text-align:left; cursor:pointer; display:flex; align-items:center; gap:8px;">
              <span style="font-size:10px; transition:transform 0.2s" :style="cidOpen ? 'transform:rotate(90deg)' : ''">▶</span>
              {{ form.cid.length ? `${form.cid.length} selecionado(s)` : 'Selecionar CIDs' }}
            </button>
            <div v-if="cidOpen" style="padding:8px 12px 12px; display:flex; flex-direction:column; gap:6px; max-height:200px; overflow-y:auto; border-top:1px solid var(--border)">
              <label v-for="c in cids" :key="c.id" style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:14px; font-weight:normal">
                <input type="checkbox" :value="c.id" v-model="form.cid" style="width:auto" />
                {{ c.code }} — {{ c.description }}
              </label>
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
        <RouterLink to="/consults" class="btn btn-ghost">Cancelar</RouterLink>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>
