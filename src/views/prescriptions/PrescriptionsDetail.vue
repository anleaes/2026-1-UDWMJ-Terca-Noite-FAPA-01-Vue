<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'
import { useConfirm } from '../../composables/useConfirm.js'

const { show } = useToast()
const { confirm } = useConfirm()
const router = useRouter()
const route = useRoute()
const id = route.params.id

const prescription = ref(null)
const items = ref([])
const medications = ref([])

onMounted(async () => {
  try {
    const [rp, ri, rm] = await Promise.all([
      axios.get(`prescriptions/${id}/`),
      axios.get('prescriptionitems/'),
      axios.get('medications/'),
    ])
    prescription.value = rp.data
    items.value = ri.data.filter(i => i.prescription === Number(id))
    medications.value = rm.data
  } catch {
    show('Erro ao carregar receita.', 'error')
  }
})

function getMedName(medId) {
  const m = medications.value.find(m => m.id === medId)
  return m ? `${m.medication} — ${m.brand}` : medId
}

async function remove() {
  const ok = await confirm('Excluir esta receita?')
  if (!ok) return
  try {
    await axios.delete(`prescriptions/${id}/`)
    show('Receita excluída com sucesso.')
    router.push('/prescriptions')
  } catch {
    show('Erro ao excluir receita.', 'error')
  }
}
</script>

<template>
  <div v-if="prescription">
    <div class="page-header">
      <div>
        <h1>Receita #{{ prescription.id }}</h1>
        <div class="subtitle">Emitida em {{ prescription.issue_date }}</div>
      </div>
      <div class="actions">
        <RouterLink to="/prescriptions" class="btn btn-ghost">← Voltar</RouterLink>
        <RouterLink :to="`/prescriptions/${id}/edit`" class="btn btn-ghost">Editar</RouterLink>
        <button class="btn btn-danger" @click="remove">Excluir</button>
      </div>
    </div>

    <div class="form-card">
      <p class="section-title">Dados da Receita</p>
      <div class="form-grid">
        <div class="form-group">
          <label>Paciente</label>
          <div class="field-value">{{ prescription.patient_name }}</div>
        </div>
        <div class="form-group">
          <label>Médico</label>
          <div class="field-value">{{ prescription.doctor_name }}</div>
        </div>
        <div class="form-group">
          <label>Consulta</label>
          <div class="field-value">Consulta #{{ prescription.consult }}</div>
        </div>
        <div class="form-group">
          <label>Data de Emissão</label>
          <div class="field-value">{{ prescription.issue_date }}</div>
        </div>
        <div v-if="prescription.instructions" class="form-group full">
          <label>Instruções</label>
          <div class="field-value">{{ prescription.instructions }}</div>
        </div>
      </div>

      <template v-if="items.length">
        <p class="section-title" style="margin-top:24px">Medicamentos</p>
        <div class="table-card" style="margin-top:0">
          <table>
            <thead>
              <tr><th>Medicamento</th><th>Quantidade</th><th>Dosagem</th><th>Frequência</th><th>Duração</th></tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{ getMedName(item.medication) }}</td>
                <td class="td-muted">{{ item.quantity }}</td>
                <td class="td-muted">{{ item.dosage }}</td>
                <td class="td-muted">{{ item.frequency }}</td>
                <td class="td-muted">{{ item.duration }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>
