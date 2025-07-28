<template>
  <div class="flex justify-center w-full px-0">
    <div class="w-full max-w-[auto] bg-[var(--color-background)] mt-5 border border-[var(--color-light-grey)]">
      <div class="flex flex-col h-[auto]">
        <!-- Main visualization area -->
        <div class="flex-1 p-4 min-h-0">
          <div class="w-full h-full overflow-auto">
            <div class="grid grid-cols-[auto_1fr] gap-0 h-full max-md:grid-cols-1 max-md:gap-4">
              <!-- First Column: Input texts and correlation -->
              <div class="flex flex-col gap-6 p-4 max-md:p-3">
                <div class="flex flex-col gap-4 max-sm:gap-3">
                  <div v-if="hasInput1" class="grid grid-cols-[auto_1fr] items-center gap-2">
                    <div class="w-[14px] h-[2px] bg-[var(--color-text)]"></div>
                    <h4 class="text-[var(--color-text)] text-sm font-[var(--font-display)] max-sm:text-xs">
                      input_1: "{{ getInputText('input1') }}"
                    </h4>
                  </div>
                  
                  <div v-if="hasInput2" class="grid grid-cols-[auto_1fr] items-center gap-2">
                    <div class="w-[14px] h-[2px] bg-[var(--color-accent2)]"></div>
                    <h4 class="text-[var(--color-text)] text-sm font-[var(--font-display)] max-sm:text-xs">
                      input_2: "{{ getInputText('input2') }}"
                    </h4>
                  </div>
                </div>
                
                <!-- Correlation Section -->
                <div v-if="hasInput1 && hasInput2" class="flex flex-col gap-3 max-sm:gap-2">
                  <h4 class="text-[var(--color-text)] text-sm font-[var(--font-display)] max-sm:text-xs">
                    correlation: {{ calculateCorrelation.toFixed(3) }}
                  </h4>
                  <div class="w-[150px] h-[6px] bg-black/10 rounded overflow-hidden">
                    <div 
                      class="h-full bg-[var(--color-accent3)] transition-[width] duration-300"
                      :style="{ width: `${Math.abs(calculateCorrelation) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
              
              <!-- Second Column: Vector visualizations -->
              <div class="flex flex-col">
                <div class="flex flex-col h-full">
                  <!-- Stacked Vector Visualization -->
                  <div v-if="hasInput1 || hasInput2" class="flex flex-col items-center">
                    <div class="flex flex-col gap-px">
                      <div 
                        v-for="(row, rowIndex) in matrix1" 
                        :key="`stacked-${rowIndex}`" 
                        class="flex gap-px"
                      >
                        <div 
                          v-for="(value, colIndex) in row" 
                          :key="`stacked-${rowIndex}-${colIndex}`"
                          class="w-4 h-4 flex items-center justify-center transition-transform duration-200 hover:scale-[2] hover:z-10 hover:relative hover:text-[10px] hover:border hover:border-[var(--color-light-grey)] relative"
                          :title="`Position [${rowIndex},${colIndex}] | Vector 1: ${value} (${getRotationDegrees(value)}°) | Vector 2: ${matrix2[rowIndex] && matrix2[rowIndex][colIndex] !== undefined ? matrix2[rowIndex][colIndex] + ' (' + getRotationDegrees(matrix2[rowIndex][colIndex]) + '°)' : 'N/A'}`"
                        >
                          <!-- Vector 1 line (bottom layer) -->
                          <div 
                            v-if="hasInput1"
                            class="vector-line-bottom"
                            :style="{ transform: `rotate(${getRotationDegrees(value)}deg)` }"
                          ></div>
                          <!-- Vector 2 line (top layer) -->
                          <div 
                            v-if="hasInput2 && matrix2[rowIndex] && matrix2[rowIndex][colIndex] !== undefined"
                            class="vector-line-top"
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
/* Essential vector line positioning - cannot be replicated with Tailwind */
.vector-line-bottom {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 2px;
  background-color: var(--color-text);
  transform-origin: center;
  z-index: 1;
  margin-left: -5px;
  margin-top: -1px;
  transition: transform 0.3s ease;
}

.vector-line-top {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 2px;
  background-color: var(--color-accent2);
  transform-origin: center;
  z-index: 2;
  opacity: 0.8;
  margin-left: -5px;
  margin-top: -1px;
  transition: transform 0.3s ease;
}
</style>
