<script setup>
import { useConfirm } from '../composables/useConfirm.js'

const { visible, title, message, answer } = useConfirm()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-backdrop" @click.self="answer(false)">
        <div class="modal-box">
          <div class="modal-icon">⚠</div>
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-msg">{{ message }}</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="answer(false)">Cancelar</button>
            <button class="btn btn-danger" @click="answer(true)">Excluir</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background: #171b26;
  border: 1px solid #2a2f42;
  border-radius: 14px;
  padding: 32px 28px;
  width: 380px;
  max-width: 90vw;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-icon {
  font-size: 28px;
  margin-bottom: 14px;
  color: #f7604f;
}

.modal-title {
  font-size: 17px;
  font-weight: 600;
  color: #e8eaf0;
  margin-bottom: 8px;
}

.modal-msg {
  font-size: 13px;
  color: #8b90a7;
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
  transform: scale(0.95) translateY(-10px);
}
.modal-box {
  transition: transform 0.2s ease;
}
</style>
