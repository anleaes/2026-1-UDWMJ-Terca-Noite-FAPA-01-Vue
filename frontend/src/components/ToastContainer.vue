<script setup>
import { useToast } from '../composables/useToast.js'

const { toasts } = useToast()
</script>

<template>
  <TransitionGroup name="toast" tag="div" class="toast-container">
    <div
      v-for="t in toasts"
      :key="t.id"
      :class="['toast', `toast-${t.type}`]"
    >
      <span class="toast-icon">{{ t.type === 'success' ? '✓' : '✕' }}</span>
      {{ t.message }}
    </div>
  </TransitionGroup>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  pointer-events: all;
  border-left: 3px solid transparent;
  min-width: 240px;
  max-width: 360px;
}

.toast-success {
  background: #171b26;
  border: 1px solid rgba(56, 217, 169, 0.25);
  border-left-color: #38d9a9;
  color: #e8eaf0;
}

.toast-error {
  background: #171b26;
  border: 1px solid rgba(247, 96, 79, 0.25);
  border-left-color: #f7604f;
  color: #e8eaf0;
}

.toast-icon {
  font-size: 12px;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-success .toast-icon {
  background: rgba(56, 217, 169, 0.2);
  color: #38d9a9;
}

.toast-error .toast-icon {
  background: rgba(247, 96, 79, 0.2);
  color: #f7604f;
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
