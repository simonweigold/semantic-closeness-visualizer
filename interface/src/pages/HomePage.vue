<template>
  <div class="max-w-4xl mx-auto p-8 font-[var(--font-display)] text-[var(--color-text)]">
    <main class="flex flex-col">
      <section class="input-section-wrapper">
        <TextInput
          v-model="textInputs.input1"
          label=""
          placeholder="text_input_1"
          border-color="var(--color-accent1)"
          :show-preview="true"
          @input="(value) => handleTextInput('input1', value)"
          @clear="() => handleTextClear('input1')"
        />
      </section>
      <section class="input-section-wrapper">
        <TextInput
          v-model="textInputs.input2"
          label=""
          placeholder="text_input_2"
          border-color="var(--color-accent2)"
          :show-preview="true"
          @input="(value) => handleTextInput('input2', value)"
          @clear="() => handleTextClear('input2')"
        />
      </section>

      <!-- Vector Visualizer Component -->
      <section class="vector-visualizer-section">
        <VectorVisualizer 
          :data="activeInputs"
          title="Semantic Closeness Visualization"
        />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TextInput from '../components/TextInput.vue'
import VectorVisualizer from '../components/VectorVisualizer.vue'

// Define the structure of our text inputs with TypeScript
interface TextInputData {
  [key: string]: string
}

// Create a data structure to store multiple text inputs
// Think of this as a box with labeled compartments
const textInputs = ref<TextInputData>({
  input1: '',  // Compartment for first input
  input2: ''   // Compartment for second input
})

// Function to handle input changes for any specific input
const handleTextInput = (inputId: string, value: string) => {
  console.log(`Text input ${inputId} changed:`, value)
  // Update the specific compartment in our data structure
  textInputs.value[inputId] = value
}

// Function to handle clearing for any specific input
const handleTextClear = (inputId: string) => {
  console.log(`Text input ${inputId} cleared`)
  // Clear the specific compartment
  textInputs.value[inputId] = ''
}

// Computed property to get all non-empty inputs
const activeInputs = computed(() => {
  return Object.entries(textInputs.value)
    .filter(([id, value]) => value.trim() !== '')
    .map(([id, value]) => ({ id, value }))
})
</script>
