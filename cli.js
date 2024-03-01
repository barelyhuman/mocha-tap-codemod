#!/usr/bin/env node

import { transform } from './lib/transform.js'
import sade from 'sade'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import glob from 'tiny-glob'
import { queue } from './lib/queue.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgFile = fs.readFileSync(join(__dirname, 'package.json'), 'utf8')

let pkgJSON = {}

try {
  pkgJSON = JSON.parse(pkgFile)
} catch (err) {}

sade('mocha-to-tap <glob>')
  .version(pkgJSON.version)
  .describe('')
  .option('-d, --dry', 'Dry Run')
  .option('-j, --jobs', 'Number of parallel transforms to run', 10)
  .example('./**/*.spec.js')
  .action((globPattern, opts) => {
    return transformWithGlob(globPattern, opts)
  })
  .parse(process.argv)

async function transformWithGlob (globPattern, options) {
  const files = await glob(globPattern, {
    filesOnly: true,
    cwd: process.cwd(),
    absolute: true
  })

  await queue(
    files,
    async (file) => {
      const isTypescript = file.endsWith('.ts') || file.endsWith('.tsx')
      const source = await fs.promises.readFile(file, 'utf8')
      const transformedCode = transform(source, { typescript: true })

      if (options.dry) {
        console.log(`
========================       
 
file: ${file}
code: ${transformedCode}
        `)
        return
      }

      fs.promises.writeFile(file, transformedCode, 'utf8')
    },
    {
      limit: options.jobs
    }
  )
}
