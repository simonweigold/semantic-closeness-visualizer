<template>
  <div class="vector-visualizer-container">
    <div class="vector-visualizer bg-[var(--color-background)] mt-5 border border-[var(--color-light-grey)]">
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
                    <div class="legend-line accent1-line"></div>
                    <h4 class="input-label text-[var(--color-text)] font-[var(--font-display)]">
                      input_1: "{{ getInputText('input1') }}"
                    </h4>
                  </div>
                  
                  <div v-if="hasInput2" class="input-text-item">
                    <div class="legend-line accent2-line"></div>
                    <h4 class="input-label text-[var(--color-text)] font-[var(--font-display)]">
                      input_2: "{{ getInputText('input2') }}"
                    </h4>
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
                  <!-- Stacked Vector Visualization -->
                  <div v-if="hasInput1 || hasInput2" class="stacked-vector-section">
                    <div class="matrix-container">
                      <div 
                        v-for="(row, rowIndex) in matrix1" 
                        :key="`stacked-${rowIndex}`" 
                        class="matrix-row"
                      >
                        <div 
                          v-for="(value, colIndex) in row" 
                          :key="`stacked-${rowIndex}-${colIndex}`"
                          class="matrix-cell stacked-cell"
                          :title="`Position [${rowIndex},${colIndex}] | Vector 1: ${value} (${getRotationDegrees(value)}°) | Vector 2: ${matrix2[rowIndex] && matrix2[rowIndex][colIndex] !== undefined ? matrix2[rowIndex][colIndex] + ' (' + getRotationDegrees(matrix2[rowIndex][colIndex]) + '°)' : 'N/A'}`"
                        >
                          <!-- Vector 1 line (bottom layer) -->
                          <div 
                            v-if="hasInput1"
                            class="vector-line accent1-line stacked-line-bottom"
                            :style="{ transform: `rotate(${getRotationDegrees(value)}deg)` }"
                          ></div>
                          <!-- Vector 2 line (top layer) -->
                          <div 
                            v-if="hasInput2 && matrix2[rowIndex] && matrix2[rowIndex][colIndex] !== undefined"
                            class="vector-line accent2-line stacked-line-top"
                            :style="{ transform: `rotate(${getRotationDegrees(matrix2[rowIndex][colIndex])}deg)` }"
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
}

.input-text-item {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.5rem;
}

.visualization-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.correlation-bar {
  height: 6px;
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

.stacked-vector-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.stacked-legend {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-line {
  width: 14px;
  height: 2px;
}

.legend-line-semi {
  opacity: 0.8;
}

.legend-text {
  color: var(--color-text);
  font-family: var(--font-display);
}

.stacked-cell {
  position: relative;
}

.stacked-line-bottom {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  z-index: 1;
}

.stacked-line-top {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  z-index: 2;
  opacity: 0.8;
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
  font-family: var(--font-display);
  transition: transform 0.2s ease;
}

.matrix-cell:hover {
  transform: scale(2);
  z-index: 10;
  position: relative;
  font-size: 10px;
  border: 0.25px solid var(--color-light-grey);
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
  
  .header-section {
    height: 50px;
    padding: 0 1rem;
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

.stacked-line-bottom {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  z-index: 1;
  margin-left: -5px;
  margin-top: -1px;
}

.stacked-line-top {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  z-index: 2;
  opacity: 0.8;
  margin-left: -5px;
  margin-top: -1px;
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
