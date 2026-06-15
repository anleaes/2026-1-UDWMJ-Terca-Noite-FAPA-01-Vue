import { ref } from 'vue'

const toasts = ref([])
let counter = 0

export function useToast() {
  function show(message, type = 'success') {
    const id = ++counter
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 3000)
  }
  return { toasts, show }
}
