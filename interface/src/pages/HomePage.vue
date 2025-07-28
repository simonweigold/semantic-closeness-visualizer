<template>
  <div class="max-w-4xl mx-auto p-8 font-[var(--font-display)] text-[var(--color-text)]">
    <header class="text-center mb-12">
      <!-- Make h1 have the accent1 color -->
      <h1 class="mb-2 text-4xl md:text-5xl">Semantic Closeness Visualizer</h1>
      <p class="text-lg md:text-xl m-0">Analyze and visualize the semantic relationships in your text</p>
    </header>

    <main class="flex flex-col gap-8">
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

      <!-- Display the data for demonstration -->
      <section v-if="activeInputs.length > 0" class="bg-[var(--color-white)] border border-[var(--color-light-grey)] rounded-lg p-6 shadow-md">
        <h2 class="text-[var(--color-text)] mb-4 pb-2 border-b-2 border-[var(--color-light-grey)] text-2xl font-[var(--font-display)]">Current Data Structure</h2>
        <div class="flex flex-col gap-2">
          <p class="m-0 py-2 text-[var(--color-text)]">Total inputs with data: <strong>{{ activeInputs.length }}</strong></p>
          <div v-for="input in activeInputs" :key="input.id" class="bg-[var(--color-accent1)]/20 p-3 rounded">
            <strong>{{ input.id }}:</strong> "{{ input.value }}"
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TextInput from '../components/TextInput.vue'

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
