import { computed, type ComputedRef } from 'vue'

export interface VectorCorrelationData {
  id: string
  value: string
}

export interface CorrelationResult {
  coefficient: number
  strength: string
  direction: string
}

export const useVectorCorrelation = (
  matrix1: ComputedRef<number[][]>,
  matrix2: ComputedRef<number[][]>
) => {
  
  // Calculate Pearson correlation coefficient between two matrices
  const calculateCorrelation = computed((): number => {
    if (!matrix1.value.length || !matrix2.value.length) return 0
    
    const vec1 = matrix1.value.flat()
    const vec2 = matrix2.value.flat()
    
    if (vec1.length !== vec2.length || vec1.length === 0) return 0
    
    // Calculate Pearson correlation coefficient
    const n = vec1.length
    const sum1 = vec1.reduce((a, b) => a + b, 0)
    const sum2 = vec2.reduce((a, b) => a + b, 0)
    const sum1Sq = vec1.reduce((a, b) => a + b * b, 0)
    const sum2Sq = vec2.reduce((a, b) => a + b * b, 0)
    const pSum = vec1.reduce((a, b, i) => a + b * vec2[i], 0)
    
    const numerator = pSum - (sum1 * sum2 / n)
    const denominator = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n))
    
    return denominator === 0 ? 0 : numerator / denominator
  })
  
  // Get correlation strength description
  const correlationStrength = computed((): string => {
    const abs = Math.abs(calculateCorrelation.value)
    if (abs >= 0.9) return 'Very Strong'
    if (abs >= 0.7) return 'Strong'
    if (abs >= 0.5) return 'Moderate'
    if (abs >= 0.3) return 'Weak'
    return 'Very Weak'
  })
  
  // Get correlation direction description
  const correlationDirection = computed((): string => {
    const coeff = calculateCorrelation.value
    if (coeff > 0.1) return 'Positive'
    if (coeff < -0.1) return 'Negative'
    return 'No Correlation'
  })
  
  // Combined correlation result
  const correlationResult = computed((): CorrelationResult => ({
    coefficient: calculateCorrelation.value,
    strength: correlationStrength.value,
    direction: correlationDirection.value
  }))
  
  return {
    calculateCorrelation,
    correlationStrength,
    correlationDirection,
    correlationResult
  }
}