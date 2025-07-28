# Semantic Closeness Visualizer

⚠️ **This tool is still under development**

A Vue.js web interface for visualizing semantic closeness between text inputs. Currently generates mock vector embeddings for demonstration purposes.

## What it does

- Takes two text inputs (up to 150 characters each)
- Generates deterministic pseudo-random 8×32 vectors from the text
- Visualizes the vectors as colored grids
- Calculates and displays correlation between vectors
- Shows a QR code linking to the project repository

## Current State

The interface is functional but uses **mock vector generation** based on character codes rather than actual semantic embeddings. A proper backend with real text vectorization (using models like BERT, Sentence Transformers, etc.) is planned but not yet implemented.

## Tech Stack

- Vue 3 with TypeScript
- Vite build system
- Tailwind CSS
- Responsive design

## Development

```sh
npm run dev
```

## Future Plans

- Connect to a backend API for real semantic embeddings
- Add support for various embedding models
- Implement proper similarity metrics beyond correlation
