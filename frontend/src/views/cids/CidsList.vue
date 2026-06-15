<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'
import { useConfirm } from '../../composables/useConfirm.js'

const { show } = useToast()
const { confirm } = useConfirm()

const cids = ref([])
const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return cids.value
  return cids.value.filter(c =>
    c.name?.toLowerCase().includes(q) ||
    c.description?.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  try {
    const res = await axios.get('cids/')
    cids.value = res.data
  } catch {
    show('Erro ao carregar CIDs.', 'error')
  }
})

async function remove(id) {
  const ok = await confirm('Excluir este CID?')
  if (!ok) return
  try {
    await axios.delete(`cids/${id}/`)
    cids.value = cids.value.filter(c => c.id !== id)
    show('CID excluído com sucesso.')
  } catch {
    show('Erro ao excluir CID.', 'error')
  }
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

  <div class="toolbar">
    <input
      v-model="search"
      type="text"
      class="search-input"
      placeholder="Buscar por código ou descrição..."
    />
  </div>

  <div class="table-card">
    <table>
      <thead>
        <tr><th>Código</th><th>Descrição</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="c in filtered" :key="c.id">
          <td class="td-mono">{{ c.name }}</td>
          <td class="td-muted">{{ c.description?.slice(0, 60) }}{{ c.description?.length > 60 ? '...' : '' }}</td>
          <td>
            <div class="actions">
              <RouterLink :to="`/cids/${c.id}/edit`" class="btn btn-sm btn-ghost">Editar</RouterLink>
              <button class="btn btn-sm btn-danger" @click="remove(c.id)">Excluir</button>
            </div>
          </td>
        </tr>
        <tr v-if="filtered.length === 0" class="empty-row">
          <td colspan="3">{{ search ? 'Nenhum resultado encontrado.' : 'Nenhum CID cadastrado.' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
