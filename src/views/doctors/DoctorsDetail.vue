<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'
import { useConfirm } from '../../composables/useConfirm.js'
import { SEX_LABELS } from '../../constants.js'

const { show } = useToast()
const { confirm } = useConfirm()
const router = useRouter()
const route = useRoute()
const id = route.params.id

const doctor = ref(null)

onMounted(async () => {
  try {
    const res = await axios.get(`doctors/${id}/`)
    doctor.value = res.data
  } catch {
    show('Erro ao carregar médico.', 'error')
  }
})

async function remove() {
  const ok = await confirm('Excluir este médico?')
  if (!ok) return
  try {
    await axios.delete(`doctors/${id}/`)
    show('Médico excluído com sucesso.')
    router.push('/doctors')
  } catch {
    show('Erro ao excluir médico.', 'error')
  }
}
</script>

<template>
  <div v-if="doctor">
    <div class="page-header">
      <div>
        <h1>{{ doctor.name }}</h1>
        <div class="subtitle">Ficha do médico</div>
      </div>
      <div class="actions">
        <RouterLink to="/doctors" class="btn btn-ghost">← Voltar</RouterLink>
        <RouterLink :to="`/doctors/${id}/edit`" class="btn btn-ghost">Editar</RouterLink>
        <button class="btn btn-danger" @click="remove">Excluir</button>
      </div>
    </div>

    <div class="form-card">
      <p class="section-title">Dados Pessoais</p>
      <div class="form-grid">
        <div class="form-group">
          <label>Nome</label>
          <div class="field-value">{{ doctor.name }}</div>
        </div>
        <div class="form-group">
          <label>CPF</label>
          <div class="field-value">{{ doctor.cpf }}</div>
        </div>
        <div class="form-group">
          <label>Data de Nascimento</label>
          <div class="field-value">{{ doctor.birth_date }}</div>
        </div>
        <div class="form-group">
          <label>Sexo</label>
          <div class="field-value">{{ SEX_LABELS[doctor.sex] ?? doctor.sex }}</div>
        </div>
        <div class="form-group full">
          <label>E-mail</label>
          <div class="field-value">{{ doctor.email }}</div>
        </div>
      </div>

      <p class="section-title" style="margin-top:24px">Dados Profissionais</p>
      <div class="form-grid">
        <div class="form-group">
          <label>CRM</label>
          <div class="field-value">{{ doctor.crm }}</div>
        </div>
        <div class="form-group">
          <label>Especialidade</label>
          <div class="field-value">{{ doctor.specialty }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
