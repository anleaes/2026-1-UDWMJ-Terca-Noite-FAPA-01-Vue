<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const patient = ref(null)
const history = ref(null)

const SEX_LABELS = { M: 'Masculino', F: 'Feminino', O: 'Outro' }

onMounted(async () => {
  const res = await axios.get(`http://localhost:8000/api/patients/${id}/`)
  patient.value = res.data
  if (res.data.allergies) {
    const h = await axios.get(`http://localhost:8000/api/medicalhistories/${res.data.allergies}/`)
    history.value = h.data
  }
})

async function remove() {
  if (!confirm('Excluir este paciente?')) return
  await axios.delete(`http://localhost:8000/api/patients/${id}/`)
  router.push('/patients')
}
</script>

<template>
  <div v-if="patient">
    <div class="page-header">
      <div>
        <h1>{{ patient.name }}</h1>
        <div class="subtitle">Ficha do paciente</div>
      </div>
      <div class="actions">
        <RouterLink to="/patients" class="btn btn-ghost">← Voltar</RouterLink>
        <RouterLink :to="`/patients/${id}/edit`" class="btn btn-ghost">Editar</RouterLink>
        <button class="btn btn-danger" @click="remove">Excluir</button>
      </div>
    </div>

    <div class="form-card">
      <p class="section-title">Dados Pessoais</p>
      <div class="form-grid">
        <div class="form-group">
          <label>Nome</label>
          <div class="field-value">{{ patient.name }}</div>
        </div>
        <div class="form-group">
          <label>CPF</label>
          <div class="field-value">{{ patient.cpf }}</div>
        </div>
        <div class="form-group">
          <label>Data de Nascimento</label>
          <div class="field-value">{{ patient.birth_date }}</div>
        </div>
        <div class="form-group">
          <label>Sexo</label>
          <div class="field-value">{{ SEX_LABELS[patient.sex] ?? patient.sex }}</div>
        </div>
        <div class="form-group full">
          <label>E-mail</label>
          <div class="field-value">{{ patient.email }}</div>
        </div>
      </div>

      <p class="section-title" style="margin-top:24px">Dados do Paciente</p>
      <div class="form-grid">
        <div class="form-group">
          <label>Contato de Emergência</label>
          <div class="field-value">{{ patient.emergency_contact || '—' }}</div>
        </div>
        <div class="form-group">
          <label>Convênio</label>
          <div class="field-value">{{ patient.health_insurance || '—' }}</div>
        </div>
      </div>

      <template v-if="history">
        <p class="section-title" style="margin-top:24px">Histórico Médico</p>
        <div class="form-grid">
          <div class="form-group full">
            <label>Alergias</label>
            <div class="field-value">{{ history.allergies || '—' }}</div>
          </div>
          <div class="form-group full">
            <label>Histórico Familiar</label>
            <div class="field-value">{{ history.family_history || '—' }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
