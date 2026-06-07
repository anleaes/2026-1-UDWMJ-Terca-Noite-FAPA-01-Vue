<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const prescription = ref(null)
const items = ref([])

onMounted(async () => {
  const [rp, ri] = await Promise.all([
    axios.get(`http://localhost:8000/api/prescriptions/${id}/`),
    axios.get('http://localhost:8000/api/prescriptionitems/'),
  ])
  prescription.value = rp.data
  items.value = ri.data.filter(i => i.prescription === Number(id))
})

async function remove() {
  if (!confirm('Excluir esta receita?')) return
  await axios.delete(`http://localhost:8000/api/prescriptions/${id}/`)
  router.push('/prescriptions')
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
                <td>{{ item.medication }}</td>
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
