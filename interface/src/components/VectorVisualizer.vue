<template>
  <div class="vector-visualizer-container">
    <div class="vector-visualizer bg-[var(--color-light-grey)] mt-5">
      <div class="visualizer-content">
        <!-- Header section -->
        <div class="header-section px-6 py-3">
          <h3 class="text-[var(--color-white)] text-lg font-[var(--font-display)]">how close are text_1 and text_2</h3>
        </div>
        
        <!-- Main visualization area -->
        <div class="visualization-area p-6">
          <div class="w-full h-full overflow-auto">
            <div class="matrix-container">
              <div 
                v-for="(row, rowIndex) in matrix" 
                :key="rowIndex" 
                class="matrix-row"
              >
                <div 
                  v-for="(value, colIndex) in row" 
                  :key="colIndex"
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Props interface for future extensibility
interface Props {
  data?: any[]
  title?: string
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  title: 'Vector Visualization'
})

// Create a reactive 8x32 matrix
const matrix = ref<number[][]>([])

// Generate random matrix on component mount
const generateRandomMatrix = () => {
  const newMatrix: number[][] = []
  for (let row = 0; row < 8; row++) {
    const currentRow: number[] = []
    for (let col = 0; col < 32; col++) {
      // Generate random integers between -100 and 100
      currentRow.push(Math.floor(Math.random() * 201) - 100)
    }
    newMatrix.push(currentRow)
  }
  matrix.value = newMatrix
}

// Function to get cell color based on value
const getCellColor = (value: number): string => {
  // Normalize value to 0-1 range for color calculation
  const normalized = (value + 100) / 200 // -100 to 100 becomes 0 to 1
  
  if (value > 0) {
    // Positive values: shades of green
    return `rgba(72, 123, 157, ${0.2 + normalized * 0.6})` // Using accent2 color
  } else if (value < 0) {
    // Negative values: shades of red
    return `rgba(230, 57, 70, ${0.2 + (1 - normalized) * 0.6})` // Using accent3 color
  } else {
    // Zero: neutral color
    return 'rgba(168, 168, 168, 0.3)' // Using light-grey color
  }
}

// Generate matrix when component mounts
onMounted(() => {
  generateRandomMatrix()
})
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
}

.visualization-area {
  flex: 1;
  min-height: 0; /* Allow flex item to shrink */
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
