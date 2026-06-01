<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const cids = ref([])

onMounted(async () => {
  const res = await axios.get('http://localhost:8000/api/cids/')
  cids.value = res.data
})

async function remove(id) {
  if (!confirm('Excluir este CID?')) return
  await axios.delete(`http://localhost:8000/api/cids/${id}/`)
  cids.value = cids.value.filter(c => c.id !== id)
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>CIDs</h1>
      <div class="subtitle">Classificações Internacionais de Doenças</div>
    </div>
    <RouterLink to="/cids/add" class="btn btn-primary">+ Novo CID</RouterLink>
  </div>
  <div class="table-card">
    <table>
      <thead>
        <tr><th>Nome</th><th>Descrição</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="c in cids" :key="c.id">
          <td>{{ c.name }}</td>
          <td class="td-muted">{{ c.description?.slice(0, 60) }}{{ c.description?.length > 60 ? '...' : '' }}</td>
          <td>
            <div class="actions">
              <RouterLink :to="`/cids/${c.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(c.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="cids.length === 0" class="empty-row">
          <td colspan="3">Nenhum CID cadastrado.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
