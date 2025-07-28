<template>
  <div class="vector-visualizer-container">
    <div class="vector-visualizer bg-[var(--color-light-grey)] mt-5">
      <div class="visualizer-content">
        <!-- Header section -->
        <div class="header-section px-6 py-3">
          <h3 class="text-[var(--color-white)] text-lg font-[var(--font-display)]">semantic_closeness</h3>
        </div>
        
        <!-- Main visualization area -->
        <div class="visualization-area p-6">
          <div class="w-full h-full overflow-auto">
            <div class="vectors-container">
              <!-- First Vector (triggered by input1) -->
              <div v-if="hasInput1" class="vector-section">
                <h4 class="vector-title text-[var(--color-text)] font-[var(--font-display)] mb-2">
                  Vector 1: "{{ getInputText('input1') }}"
                </h4>
                <div class="matrix-container">
                  <div 
                    v-for="(row, rowIndex) in matrix1" 
                    :key="`matrix1-${rowIndex}`" 
                    class="matrix-row"
                  >
                    <div 
                      v-for="(value, colIndex) in row" 
                      :key="`matrix1-${rowIndex}-${colIndex}`"
                      class="matrix-cell"
                      :style="{ backgroundColor: getCellColor(value) }"
                    >
                      {{ value }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Second Vector (triggered by input2) -->
              <div v-if="hasInput2" class="vector-section">
                <h4 class="vector-title text-[var(--color-text)] font-[var(--font-display)] mb-2">
                  Vector 2: "{{ getInputText('input2') }}"
                </h4>
                <div class="matrix-container">
                  <div 
                    v-for="(row, rowIndex) in matrix2" 
                    :key="`matrix2-${rowIndex}`" 
                    class="matrix-row"
                  >
                    <div 
                      v-for="(value, colIndex) in row" 
                      :key="`matrix2-${rowIndex}-${colIndex}`"
                      class="matrix-cell"
                      :style="{ backgroundColor: getCellColor(value) }"
                    >
                      {{ value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props interface for future extensibility
interface Props {
  data?: Array<{ id: string; value: string }>
  title?: string
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  title: 'Vector Visualization'
})

// Create reactive matrices for both inputs
const matrix1 = ref<number[][]>([])
const matrix2 = ref<number[][]>([])

// Computed properties to check if inputs exist
const hasInput1 = computed(() => {
  return props.data.some(item => item.id === 'input1' && item.value.trim() !== '')
})

const hasInput2 = computed(() => {
  return props.data.some(item => item.id === 'input2' && item.value.trim() !== '')
})

// Function to get input text by ID
const getInputText = (inputId: string): string => {
  const input = props.data.find(item => item.id === inputId)
  return input ? input.value : ''
}

// Generate vector matrix based on text input
const generateVectorFromText = (text: string): number[][] => {
  const newMatrix: number[][] = []
  
  // Use text as seed for consistent random generation
  const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  for (let row = 0; row < 8; row++) {
    const currentRow: number[] = []
    for (let col = 0; col < 32; col++) {
      // Generate pseudo-random numbers based on text seed, row, and column
      const pseudoRandom = Math.sin(seed + row * 32 + col) * 10000
      const value = Math.floor((pseudoRandom - Math.floor(pseudoRandom)) * 201) - 100
      currentRow.push(value)
    }
    newMatrix.push(currentRow)
  }
  
  return newMatrix
}

// Function to get cell color based on value
const getCellColor = (value: number): string => {
  // Normalize value to 0-1 range for color calculation
  const normalized = (value + 100) / 200 // -100 to 100 becomes 0 to 1
  
  if (value > 0) {
    // Positive values: shades of blue
    return `rgba(72, 123, 157, ${0.2 + normalized * 0.6})` // Using accent2 color
  } else if (value < 0) {
    // Negative values: shades of red
    return `rgba(230, 57, 70, ${0.2 + (1 - normalized) * 0.6})` // Using accent3 color
  } else {
    // Zero: neutral color
    return 'rgba(168, 168, 168, 0.3)' // Using light-grey color
  }
}

// Watch for changes in input data and regenerate matrices
watch(() => props.data, (newData) => {
  // Update matrix1 if input1 exists
  const input1 = newData.find(item => item.id === 'input1')
  if (input1 && input1.value.trim() !== '') {
    matrix1.value = generateVectorFromText(input1.value)
  } else {
    matrix1.value = []
  }
  
  // Update matrix2 if input2 exists
  const input2 = newData.find(item => item.id === 'input2')
  if (input2 && input2.value.trim() !== '') {
    matrix2.value = generateVectorFromText(input2.value)
  } else {
    matrix2.value = []
  }
}, { immediate: true, deep: true })
</script>

<style scoped>
.vector-visualizer-container {
  /* Center the component horizontally */
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 1rem; /* Add some padding to prevent touching screen edges */
}

.vector-visualizer {
  /* Responsive dimensions that never exceed screen size */
  width: 100%;
  max-width: 1400px;
  height: 350px;
  min-width: 320px; /* Minimum width for mobile */
  
  /* Maintain aspect ratio on very small screens */
  min-height: 200px;
}

.visualizer-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header-section {
  flex-shrink: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visualization-area {
  flex: 1;
  min-height: 0; /* Allow flex item to shrink */
}

.vectors-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.vector-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vector-title {
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  max-width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.placeholder-section {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.matrix-container {
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: fit-content;
  margin: 0 auto;
}

.matrix-row {
  display: flex;
  gap: 1px;
}

.matrix-cell {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 500;
  color: var(--color-text);
  border: 1px solid var(--color-light-grey);
  font-family: var(--font-display);
  transition: transform 0.2s ease;
}

.matrix-cell:hover {
  transform: scale(2);
  z-index: 10;
  position: relative;
  font-size: 10px;
  border: 2px solid var(--color-text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Responsive breakpoints */
@media (max-width: 1440px) {
  .vector-visualizer-container {
    padding: 0 0.5rem;
  }
}

@media (max-width: 768px) {
  .vector-visualizer {
    height: 250px; /* Smaller height on mobile */
  }
  
  .header-section {
    height: 50px;
    padding: 0 1rem;
  }
  
  .header-section h3 {
    font-size: 1rem;
  }
  
  .visualization-area {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .vector-visualizer {
    height: 200px; /* Even smaller on very small screens */
  }
  
  .visualization-area {
    padding: 0.75rem;
  }
}
</style>
