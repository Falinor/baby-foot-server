import fs from 'fs/promises'
import path from 'path'

import { config } from '../core'

const file = path.join(config.root, 'state.json')

export async function serialize(state) {
  const data = JSON.stringify(state, null, '')
  await fs.writeFile(file, data, 'utf8')
}

export async function deserialize() {
  const data = await fs.readFile(file, 'utf8')
  return JSON.parse(data)
}
