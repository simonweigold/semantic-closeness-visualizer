import { ref, watch, type Ref } from 'vue'

// Interface for input data structure
export interface TextInputData {
  id: string
  value: string
}

// Interface for vector configuration
export interface VectorConfig {
  rows: number
  cols: number
  valueRange: {
    min: number
    max: number
  }
}

// Default configuration for 8x32 vectors with values from -100 to 100
const DEFAULT_CONFIG: VectorConfig = {
  rows: 8,
  cols: 32,
  valueRange: {
    min: 0,
    max: 100
  }
}

/**
 * Composable for transforming text inputs into vector matrices
 * @param inputData - Reactive array of text input data
 * @param config - Optional vector configuration
 */
export function useTextToVector(
  inputData: Ref<TextInputData[]>,
  config: VectorConfig = DEFAULT_CONFIG
) {
  // Reactive storage for generated vectors
  const vectors = ref<Map<string, number[][]>>(new Map())

  /**
   * Generate a deterministic pseudo-random seed from text
   * @param text - Input text string
   * @returns numeric seed value
   */
  const generateSeed = (text: string): number => {
    return text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  }

  /**
   * Generate a vector matrix from text input
   * @param text - Input text string
   * @param seed - Optional custom seed (uses text-based seed if not provided)
   * @returns 2D array representing the vector matrix
   */
  const generateVectorFromText = (text: string, seed?: number): number[][] => {
    const actualSeed = seed ?? generateSeed(text)
    const matrix: number[][] = []
    const { rows, cols, valueRange } = config
    const range = valueRange.max - valueRange.min + 1

    for (let row = 0; row < rows; row++) {
      const currentRow: number[] = []
      for (let col = 0; col < cols; col++) {
        // Generate pseudo-random numbers based on seed, row, and column
        const pseudoRandom = Math.sin(actualSeed + row * cols + col) * 10000
        const normalized = pseudoRandom - Math.floor(pseudoRandom)
        const value = Math.floor(normalized * range) + valueRange.min
        currentRow.push(value)
      }
      matrix.push(currentRow)
    }

    return matrix
  }

  /**
   * Get vector matrix for a specific input ID
   * @param inputId - ID of the text input
   * @returns vector matrix or empty array if not found
   */
  const getVector = (inputId: string): number[][] => {
    return vectors.value.get(inputId) || []
  }

  /**
   * Check if a vector exists for the given input ID
   * @param inputId - ID of the text input
   * @returns boolean indicating if vector exists
   */
  const hasVector = (inputId: string): boolean => {
    return vectors.value.has(inputId) && vectors.value.get(inputId)!.length > 0
  }

  /**
   * Get all available vector IDs
   * @returns array of input IDs that have vectors
   */
  const getVectorIds = (): string[] => {
    return Array.from(vectors.value.keys()).filter(id => hasVector(id))
  }

  /**
   * Manually generate and store a vector for specific text
   * @param inputId - ID to store the vector under
   * @param text - Text to generate vector from
   * @param customSeed - Optional custom seed
   */
  const generateVector = (inputId: string, text: string, customSeed?: number): void => {
    if (text.trim() === '') {
      vectors.value.delete(inputId)
    } else {
      const vector = generateVectorFromText(text, customSeed)
      vectors.value.set(inputId, vector)
    }
  }

  /**
   * Clear vector for specific input ID
   * @param inputId - ID of the input to clear
   */
  const clearVector = (inputId: string): void => {
    vectors.value.delete(inputId)
  }

  /**
   * Clear all vectors
   */
  const clearAllVectors = (): void => {
    vectors.value.clear()
  }

  // Watch for changes in input data and automatically update vectors
  watch(
    inputData,
    (newData) => {
      // Get current vector IDs
      const currentIds = new Set(vectors.value.keys())
      const newIds = new Set(newData.map(item => item.id))

      // Remove vectors for inputs that no longer exist
      currentIds.forEach(id => {
        if (!newIds.has(id)) {
          vectors.value.delete(id)
        }
      })

      // Update or create vectors for current inputs
      newData.forEach(({ id, value }) => {
        if (value.trim() !== '') {
          const newVector = generateVectorFromText(value)
          vectors.value.set(id, newVector)
        } else {
          vectors.value.delete(id)
        }
      })
    },
    { immediate: true, deep: true }
  )

  return {
    // Reactive data
    vectors: vectors.value,
    
    // Utility functions
    getVector,
    hasVector,
    getVectorIds,
    generateVector,
    clearVector,
    clearAllVectors,
    generateVectorFromText,
    
    // Configuration
    config
  }
}
