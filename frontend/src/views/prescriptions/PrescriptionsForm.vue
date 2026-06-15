<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'

const { show } = useToast()
const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ consult: '', patient: '', doctor: '', instructions: '' })
const consults = ref([])
const patients = ref([])
const doctors = ref([])
const medications = ref([])
const items = ref([])

const openMedIndex = ref(null)
const dropdownPos = ref({ top: 0, left: 0, width: 0 })
const medSearch = ref('')

function newItem() {
  return { id: null, medication: '', quantity: '', dosage: '', frequency: '', duration: '', toDelete: false }
}

function addItem() {
  items.value.push(newItem())
}

function removeItem(index) {
  const item = items.value[index]
  if (openMedIndex.value === index) openMedIndex.value = null
  if (item.id) {
    item.toDelete = true
  } else {
    items.value.splice(index, 1)
  }
}

function toggleMedDropdown(index, event) {
  if (openMedIndex.value === index) {
    openMedIndex.value = null
    return
  }
  const rect = event.currentTarget.getBoundingClientRect()
  dropdownPos.value = { top: rect.bottom + 4, left: rect.left, width: rect.width }
  medSearch.value = ''
  openMedIndex.value = index
}

function selectMedication(medId) {
  items.value[openMedIndex.value].medication = medId
  openMedIndex.value = null
}

function getMedName(medId) {
  const m = medications.value.find(m => m.id == medId)
  return m ? `${m.medication} — ${m.brand}` : 'Selecionar Medicamento'
}

const filteredMeds = computed(() => {
  const q = medSearch.value.trim().toLowerCase()
  if (!q) return medications.value
  return medications.value.filter(m =>
    m.medication.toLowerCase().includes(q) ||
    m.brand.toLowerCase().includes(q)
  )
})

function onOutsideClick(e) {
  if (openMedIndex.value === null) return
  if (!e.target.closest('.med-dropdown-trigger') && !e.target.closest('.med-dropdown-panel')) {
    openMedIndex.value = null
  }
}

onMounted(async () => {
  document.addEventListener('click', onOutsideClick)

  const [rc, rp, rd, rm] = await Promise.all([
    axios.get('http://localhost:8000/api/consults/'),
    axios.get('http://localhost:8000/api/patients/'),
    axios.get('http://localhost:8000/api/doctors/'),
    axios.get('http://localhost:8000/api/medications/'),
  ])
  consults.value = rc.data
  patients.value = rp.data
  doctors.value = rd.data
  medications.value = rm.data

  if (id) {
    const r = await axios.get(`http://localhost:8000/api/prescriptions/${id}/`)
    form.value = r.data

    const ri = await axios.get('http://localhost:8000/api/prescriptionitems/')
    const existingItems = ri.data.filter(i => i.prescription == id)
    items.value = existingItems.map(i => ({ ...i, toDelete: false }))
  }

  if (items.value.length === 0) {
    items.value.push(newItem())
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onOutsideClick)
})

async function save() {
  try {
    let prescriptionId = id
    if (id) {
      await axios.put(`http://localhost:8000/api/prescriptions/${id}/`, form.value)
    } else {
      const r = await axios.post('http://localhost:8000/api/prescriptions/', form.value)
      prescriptionId = r.data.id
    }

    for (const item of items.value) {
      if (item.toDelete && item.id) {
        await axios.delete(`http://localhost:8000/api/prescriptionitems/${item.id}/`)
      } else if (!item.toDelete && item.medication) {
        const payload = {
          prescription: prescriptionId,
          medication: item.medication,
          quantity: item.quantity,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
        }
        if (item.id) {
          await axios.put(`http://localhost:8000/api/prescriptionitems/${item.id}/`, payload)
        } else {
          await axios.post('http://localhost:8000/api/prescriptionitems/', payload)
        }
      }
    }

    show(id ? 'Receita atualizada com sucesso.' : 'Receita criada com sucesso.')
    router.push('/prescriptions')
  } catch {
    show('Erro ao salvar receita.', 'error')
  }
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>{{ id ? 'Editar Receita' : 'Nova Receita' }}</h1>
      <div class="subtitle">Emissão de receita médica</div>
    </div>
    <RouterLink to="/prescriptions" class="btn btn-ghost">← Voltar</RouterLink>
  </div>
  <div class="form-card">
    <form @submit.prevent="save">
      <div class="form-grid">
        <div class="form-group full">
          <label>Consulta</label>
          <select v-model="form.consult" required>
            <option value="">---------</option>
            <option v-for="c in consults" :key="c.id" :value="c.id">Consulta #{{ c.id }}</option>
          </select>
        </div>
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
        <div class="form-group full">
          <label>Instruções</label>
          <textarea v-model="form.instructions"></textarea>
        </div>
      </div>

      <p class="section-title" style="margin-top:28px">Itens da Receita</p>
      <div class="table-card" style="margin-bottom:16px">
        <table>
          <thead>
            <tr>
              <th>Medicamento</th>
              <th>Quantidade</th>
              <th>Dosagem</th>
              <th>Frequência</th>
              <th>Duração</th>
              <th>Remover</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in items" :key="index">
              <tr v-if="!item.toDelete" class="formset-row">
                <td style="min-width:220px">
                  <button
                    type="button"
                    class="med-dropdown-trigger"
                    @click="toggleMedDropdown(index, $event)"
                    style="width:100%; padding:8px 10px; background:var(--surface2); border:1px solid var(--border); border-radius:8px; color:var(--text); font-size:13px; text-align:left; cursor:pointer; display:flex; align-items:center; gap:6px;"
                  >
                    <span style="font-size:10px; transition:transform 0.2s" :style="openMedIndex === index ? 'transform:rotate(90deg)' : ''">▶</span>
                    <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis">{{ getMedName(item.medication) }}</span>
                  </button>
                </td>
                <td><input type="text" v-model="item.quantity" /></td>
                <td><input type="text" v-model="item.dosage" /></td>
                <td><input type="text" v-model="item.frequency" /></td>
                <td><input type="text" v-model="item.duration" /></td>
                <td>
                  <input type="checkbox" @change="removeItem(index)" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <button type="button" class="btn btn-ghost" @click="addItem">+ Adicionar Item</button>

      <div class="form-actions">
        <button type="button" class="btn btn-ghost" @click="router.back()">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar Receita</button>
      </div>
    </form>
  </div>

  <!-- Dropdown teleportado para o body para evitar o overflow:hidden da table-card -->
  <Teleport to="body">
    <div
      v-if="openMedIndex !== null"
      class="med-dropdown-panel"
      :style="{
        position: 'fixed',
        top: dropdownPos.top + 'px',
        left: dropdownPos.left + 'px',
        width: dropdownPos.width + 'px',
        minWidth: '260px',
        zIndex: 9999,
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }"
    >
      <div style="padding:8px 10px">
        <input
          v-model="medSearch"
          type="text"
          placeholder="Buscar por medicamento ou marca..."
          style="width:100%; padding:6px 8px; background:var(--bg); border:1px solid var(--border); border-radius:6px; color:var(--text); font-size:13px; outline:none; box-sizing:border-box;"
          @click.stop
        />
      </div>
      <div style="padding:0 10px 10px; display:flex; flex-direction:column; gap:4px; max-height:200px; overflow-y:auto;">
        <div
          v-for="m in filteredMeds"
          :key="m.id"
          @click="selectMedication(m.id)"
          style="padding:6px 8px; border-radius:6px; cursor:pointer; font-size:13px;"
          :style="items[openMedIndex]?.medication == m.id ? 'background:var(--primary); color:#fff' : 'color:var(--text)'"
          @mouseenter="e => { if(items[openMedIndex]?.medication != m.id) e.currentTarget.style.background='var(--surface3)' }"
          @mouseleave="e => { if(items[openMedIndex]?.medication != m.id) e.currentTarget.style.background='' }"
        >
          {{ m.medication }} — {{ m.brand }}
        </div>
        <span v-if="filteredMeds.length === 0" style="font-size:12px; color:var(--text3); padding:4px 0">Nenhum medicamento encontrado.</span>
      </div>
    </div>
  </Teleport>
</template>
