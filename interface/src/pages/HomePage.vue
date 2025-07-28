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
          v-model="userInput"
          label=""
          placeholder="text_input_1"
          border-color="var(--color-accent1)"
          :show-preview="true"
          @input="handleTextInput"
          @clear="handleTextClear"
        />
      </section>
      <section class="input-section-wrapper">
        <TextInput
          v-model="userInput"
          label=""
          placeholder="text_input_2"
          border-color="var(--color-accent2)"
          :show-preview="true"
          @input="handleTextInput"
          @clear="handleTextClear"
        />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TextInput from '../components/TextInput.vue'

const userInput = ref('')

const handleTextInput = (value: string) => {
  console.log('Text input changed:', value)
  // Here you can add any additional logic when text changes
}

const handleTextClear = () => {
  console.log('Text input cleared')
  // Here you can add any additional logic when text is cleared
}
</script>
