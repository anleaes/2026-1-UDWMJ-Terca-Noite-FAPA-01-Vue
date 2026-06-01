<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const medications = ref([])

onMounted(async () => {
  const res = await axios.get('http://localhost:8000/api/medications/')
  medications.value = res.data
})

async function remove(id) {
  if (!confirm('Excluir este medicamento?')) return
  await axios.delete(`http://localhost:8000/api/medications/${id}/`)
  medications.value = medications.value.filter(m => m.id !== id)
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>Medicamentos</h1>
      <div class="subtitle">Lista de medicamentos cadastrados</div>
    </div>
    <RouterLink to="/medications/add" class="btn btn-primary">+ Novo Medicamento</RouterLink>
  </div>
  <div class="table-card">
    <table>
      <thead>
        <tr><th>Medicamento</th><th>Marca</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="m in medications" :key="m.id">
          <td>{{ m.medication }}</td>
          <td class="td-muted">{{ m.brand }}</td>
          <td>
            <div class="actions">
              <RouterLink :to="`/medications/${m.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(m.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="medications.length === 0" class="empty-row">
          <td colspan="3">Nenhum medicamento cadastrado.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
