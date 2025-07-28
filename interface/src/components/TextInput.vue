<template>
  <div class="bg-[var(--color-light-grey)] p-6 mb-8 font-[var(--font-display)] text-[var(--color-text)]">
    <label for="text-input" class="block mb-2">{{ label }}</label>
    <div class="flex gap-2 mb-4">
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
    <!--
    <p v-if="localValue && showPreview" class="bg-accent1/20 px-3 py-3 rounded border-l-4 border-accent1 m-0 text-text">
      You typed: <strong class="font-bold">{{ localValue }}</strong>
    </p>
    -->
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
