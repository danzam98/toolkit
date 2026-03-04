#!/usr/bin/env bun

/**
 * Image Optimization Script
 *
 * Generates AVIF/WebP responsive images from source images.
 *
 * Usage:
 *   bun run scripts/optimize-images.ts
 *   bun run scripts/optimize-images.ts --input ./src/images --output ./public/images
 */

import sharp from 'sharp'
import { readdir, mkdir, stat } from 'fs/promises'
import { join, basename, extname } from 'path'

const DEFAULT_INPUT = './src/images'
const DEFAULT_OUTPUT = './public/images'
const SIZES = [640, 750, 828, 1080, 1200, 1920]
const FORMATS = ['avif', 'webp'] as const

interface OptimizeOptions {
  input: string
  output: string
  sizes?: number[]
  quality?: number
}

async function optimizeImage(
  inputPath: string,
  outputDir: string,
  sizes: number[],
  quality: number
): Promise<void> {
  const name = basename(inputPath, extname(inputPath))
  const image = sharp(inputPath)
  const metadata = await image.metadata()

  if (!metadata.width || !metadata.height) {
    console.warn(`  Skipping ${inputPath}: could not read dimensions`)
    return
  }

  // Only generate sizes smaller than or equal to original
  const applicableSizes = sizes.filter((s) => s <= metadata.width!)

  for (const width of applicableSizes) {
    const resized = sharp(inputPath).resize(width)

    // Generate AVIF
    await resized
      .clone()
      .avif({ quality: quality - 5 }) // AVIF can use lower quality
      .toFile(join(outputDir, `${name}-${width}.avif`))

    // Generate WebP
    await resized
      .clone()
      .webp({ quality })
      .toFile(join(outputDir, `${name}-${width}.webp`))
  }

  console.log(`  ✓ ${name}: generated ${applicableSizes.length * 2} variants`)
}

async function getImageFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await getImageFiles(path)))
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      files.push(path)
    }
  }

  return files
}

async function optimize(options: OptimizeOptions): Promise<void> {
  const { input, output, sizes = SIZES, quality = 85 } = options

  console.log(`\n📸 Image Optimization\n`)
  console.log(`Input:  ${input}`)
  console.log(`Output: ${output}`)
  console.log(`Sizes:  ${sizes.join(', ')}`)
  console.log(`Quality: ${quality}\n`)

  // Ensure output directory exists
  await mkdir(output, { recursive: true })

  // Find all images
  const files = await getImageFiles(input)

  if (files.length === 0) {
    console.log('No images found.')
    return
  }

  console.log(`Found ${files.length} images:\n`)

  // Process each image
  for (const file of files) {
    await optimizeImage(file, output, sizes, quality)
  }

  console.log(`\n✅ Done! Generated images in ${output}\n`)
}

// Parse CLI arguments
const args = process.argv.slice(2)
const inputIndex = args.indexOf('--input')
const outputIndex = args.indexOf('--output')

const input = inputIndex !== -1 ? args[inputIndex + 1] : DEFAULT_INPUT
const output = outputIndex !== -1 ? args[outputIndex + 1] : DEFAULT_OUTPUT

optimize({ input, output }).catch(console.error)
