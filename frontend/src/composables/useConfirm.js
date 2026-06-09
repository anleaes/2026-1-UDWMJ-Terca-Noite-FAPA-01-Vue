import { ref } from 'vue'

const visible = ref(false)
const title = ref('')
const message = ref('')
let resolveFn = null

export function useConfirm() {
  function confirm(titleText, messageText = 'Esta ação não pode ser desfeita.') {
    title.value = titleText
    message.value = messageText
    visible.value = true
    return new Promise(resolve => {
      resolveFn = resolve
    })
  }
  function answer(val) {
    visible.value = false
    resolveFn?.(val)
  }
  return { visible, title, message, confirm, answer }
}
