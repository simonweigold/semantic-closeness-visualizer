<template>
  <div class="vector-visualizer-container">
    <div class="vector-visualizer bg-[var(--color-light-grey)] mt-5">
      <div class="visualizer-content">
        <!-- Header section -->
        <div class="header-section px-6 py-3">
          <h3 class="text-[var(--color-text)] text-lg font-[var(--font-display)]">semantic_closeness</h3>
        </div>
        
        <!-- Main visualization area -->
        <div class="visualization-area p-6">
          <div class="w-full h-full overflow-auto">
            <div class="main-content-grid">
              <!-- First Column: Input texts and correlation -->
              <div class="input-column">
                <div class="input-texts-section">
                  <div v-if="hasInput1" class="input-text-item">
                    <h4 class="input-label text-[var(--color-text)] font-[var(--font-display)]">
                      Input 1:
                    </h4>
                    <div class="input-text-display accent1-border">
                      "{{ getInputText('input1') }}"
                    </div>
                  </div>
                  
                  <div v-if="hasInput2" class="input-text-item">
                    <h4 class="input-label text-[var(--color-text)] font-[var(--font-display)]">
                      Input 2:
                    </h4>
                    <div class="input-text-display accent2-border">
                      "{{ getInputText('input2') }}"
                    </div>
                  </div>
                </div>
                
                <!-- Correlation Section -->
                <div v-if="hasInput1 && hasInput2" class="correlation-section">
                  <h4 class="correlation-label text-[var(--color-text)] font-[var(--font-display)]">
                    Correlation
                  </h4>
                  <div class="correlation-display">
                    <div class="correlation-value">
                      {{ calculateCorrelation.toFixed(3) }}
                    </div>
                    <div class="correlation-bar">
                      <div 
                        class="correlation-fill"
                        :style="{ width: `${Math.abs(calculateCorrelation) * 100}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Second Column: Vector visualizations -->
              <div class="visualization-column">
                <div class="vectors-container">
                  <!-- First Vector (triggered by input1) -->
                  <div v-if="hasInput1" class="vector-section">
                    <h4 class="vector-title text-[var(--color-text)] font-[var(--font-display)]">
                      Vector 1
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
                          :title="`Value: ${value}, Rotation: ${getRotationDegrees(value)}°`"
                        >
                          <div 
                            class="vector-line accent1-line"
                            :style="{ transform: `rotate(${getRotationDegrees(value)}deg)` }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Second Vector (triggered by input2) -->
                  <div v-if="hasInput2" class="vector-section">
                    <h4 class="vector-title text-[var(--color-text)] font-[var(--font-display)]">
                      Vector 2
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
                          :title="`Value: ${value}, Rotation: ${getRotationDegrees(value)}°`"
                        >
                          <div 
                            class="vector-line accent2-line"
                            :style="{ transform: `rotate(${getRotationDegrees(value)}deg)` }"
                          ></div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTextToVector, type TextInputData } from '../composables/useTextToVector'
import { useVectorCorrelation } from '../composables/useVectorCorrelation'

// Props interface for future extensibility
interface Props {
  data?: TextInputData[]
  title?: string
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  title: 'Vector Visualization'
})

// Use the text-to-vector composable
const {
  getVector,
  hasVector,
  getVectorIds
} = useTextToVector(computed(() => props.data))

// Computed properties to check if inputs exist
const hasInput1 = computed(() => hasVector('input1'))
const hasInput2 = computed(() => hasVector('input2'))

// Get matrices for both inputs
const matrix1 = computed(() => getVector('input1'))
const matrix2 = computed(() => getVector('input2'))

// Use the vector correlation composable
const {
  calculateCorrelation,
  correlationResult
} = useVectorCorrelation(matrix1, matrix2)

// Function to get input text by ID
const getInputText = (inputId: string): string => {
  const input = props.data.find(item => item.id === inputId)
  return input ? input.value : ''
}

// Function to get rotation degrees based on value
const getRotationDegrees = (value: number): number => {
  // Map 0-100 to 0-360 degrees
  return (value / 100) * 360
}
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

.main-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  height: 100%;
}

.input-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.visualization-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-texts-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-text-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.input-text-display {
  padding: 0.75rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.5);
  border-left: 4px solid;
  font-size: 13px;
  line-height: 1.4;
  word-wrap: break-word;
  max-height: 100px;
  overflow-y: auto;
}

.accent1-border {
  border-left-color: var(--color-accent1);
}

.accent2-border {
  border-left-color: var(--color-accent2);
}

.correlation-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  border: 2px solid var(--color-accent3);
}

.correlation-label {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: var(--color-accent3);
}

.correlation-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.correlation-value {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-accent3);
  text-align: center;
}

.correlation-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.correlation-fill {
  height: 100%;
  background: var(--color-accent3);
  transition: width 0.3s ease;
}

.vector-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.vector-title {
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin: 0;
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
    height: 300px; /* Taller height for mobile to accommodate stacked layout */
  }
  
  .main-content-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .input-column {
    padding: 0.75rem;
  }
  
  .input-label, .vector-title {
    font-size: 12px;
  }
  
  .correlation-label {
    font-size: 14px;
  }
  
  .correlation-value {
    font-size: 20px;
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
    height: 350px; /* Even taller on very small screens for better content fit */
  }
  
  .input-texts-section {
    gap: 0.75rem;
  }
  
  .input-text-display {
    padding: 0.5rem;
    font-size: 12px;
    max-height: 80px;
  }
  
  .correlation-section {
    padding: 0.75rem;
  }
  
  .input-label, .vector-title {
    font-size: 11px;
  }
  
  .correlation-label {
    font-size: 13px;
  }
  
  .correlation-value {
    font-size: 18px;
  }
  
  .visualization-area {
    padding: 0.75rem;
  }
}

/* Vector line styles */
.vector-line {
  width: 10px;
  height: 2px;
  transform-origin: center;
  transition: transform 0.3s ease;
}

.accent1-line {
  background-color: var(--color-accent1);
}

.accent2-line {
  background-color: var(--color-accent2);
}

.accent3-line {
  background-color: var(--color-accent3);
}
</style>
