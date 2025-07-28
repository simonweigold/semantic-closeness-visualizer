<template>
  <div class="bg-[var(--color-background)] p-6 font-[var(--font-display)] text-[var(--color-text)]">
    <label for="text-input" class="block">{{ label }}</label>
    <div class="flex gap-2">
      <input
        id="text-input"
        type="text"
        v-model="localValue"
        @input="handleInputChange"
        :placeholder="placeholder"
        :class="`flex-1 px-3 py-3 border-2 rounded focus:outline-none focus:ring-1 text-base transition-all duration-200`"
        :style="{
          borderColor: borderColor,
          '--tw-ring-color': borderColor
        }"
      />
      <button 
        @click="clearInput" 
        :disabled="!localValue"
        class="px-4 py-3 text-text border-none rounded cursor-pointer text-sm transition-all duration-200 hover:bg-accent3/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        clear
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  showPreview?: boolean
  borderColor?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'input', value: string): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: 'Enter your text:',
  placeholder: 'Type something here...',
  showPreview: true,
  borderColor: 'var(--color-dark-grey)'
})

const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue)

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

// Watch for internal changes and emit them
watch(localValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  localValue.value = target.value
  emit('input', target.value)
}

const clearInput = () => {
  localValue.value = ''
  emit('clear')
}
</script>
