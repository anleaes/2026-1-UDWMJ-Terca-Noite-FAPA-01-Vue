<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const patients = ref([])

onMounted(async () => {
  const response = await axios.get('http://localhost:8000/api/patients/')
  patients.value = response.data
})
</script>

<template>
  <h1>Pacientes</h1>
  <ul>
    <li v-for="patient in patients" :key="patient.id">
      {{ patient.name }} — {{ patient.cpf }}
    </li>
  </ul>
</template>
