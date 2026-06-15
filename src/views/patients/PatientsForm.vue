<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'

const { show } = useToast()
const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ name: '', cpf: '', birth_date: '', email: '', sex: '', emergency_contact: '', health_insurance: '', allergies: null })
const histories = ref([])
const historyForm = ref({ allergies: '', family_history: '' })

onMounted(async () => {
  try {
    const res = await axios.get('medicalhistories/')
    histories.value = res.data
    if (id) {
      const r = await axios.get(`patients/${id}/`)
      form.value = r.data
    }
  } catch {
    show('Erro ao carregar dados.', 'error')
  }
})

async function save() {
  try {
    if (id) {
      await axios.put(`patients/${id}/`, form.value)
    } else {
      const historyRes = await axios.post('medicalhistories/', {
        patient_name: form.value.name,
        allergies: historyForm.value.allergies,
        family_history: historyForm.value.family_history,
      })
      await axios.post('patients/', {
        ...form.value,
        allergies: historyRes.data.id,
      })
    }
    show(id ? 'Paciente atualizado com sucesso.' : 'Paciente cadastrado com sucesso.')
    router.push('/patients')
  } catch {
    show('Erro ao salvar paciente.', 'error')
  }
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>{{ id ? 'Editar Paciente' : 'Novo Paciente' }}</h1>
      <div class="subtitle">Cadastro de paciente</div>
    </div>
    <RouterLink to="/patients" class="btn btn-ghost">← Voltar</RouterLink>
  </div>
  <div class="form-card">
    <form @submit.prevent="save">
      <p class="section-title">Dados Pessoais</p>
      <div class="form-grid">
        <div class="form-group">
          <label>Nome</label>
          <input type="text" v-model="form.name" required />
        </div>
        <div class="form-group">
          <label>CPF</label>
          <input type="text" v-model="form.cpf" required />
        </div>
        <div class="form-group">
          <label>Data de Nascimento</label>
          <input type="date" v-model="form.birth_date" required />
        </div>
        <div class="form-group">
          <label>Sexo</label>
          <select v-model="form.sex" required>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="O">Outro</option>
          </select>
        </div>
        <div class="form-group full">
          <label>E-mail</label>
          <input type="email" v-model="form.email" required />
        </div>
      </div>
      <p class="section-title" style="margin-top:24px">Dados do Paciente</p>
      <div class="form-grid">
        <div class="form-group">
          <label>Contato de Emergência</label>
          <input type="text" v-model="form.emergency_contact" />
        </div>
        <div class="form-group">
          <label>Convênio</label>
          <input type="text" v-model="form.health_insurance" />
        </div>
        <template v-if="id">
          <div class="form-group full">
            <label>Histórico Médico</label>
            <select v-model="form.allergies">
              <option :value="null">---------</option>
              <option v-for="h in histories" :key="h.id" :value="h.id">{{ h.patient_name }}</option>
            </select>
          </div>
        </template>
        <template v-else>
          <div class="form-group full">
            <label>Alergias</label>
            <textarea v-model="historyForm.allergies"></textarea>
          </div>
          <div class="form-group full">
            <label>Histórico Familiar</label>
            <textarea v-model="historyForm.family_history"></textarea>
          </div>
        </template>
      </div>
      <div class="form-actions">
        <RouterLink to="/patients" class="btn btn-ghost">Cancelar</RouterLink>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>
