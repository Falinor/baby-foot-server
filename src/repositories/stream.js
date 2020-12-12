import OBSWebSocket from 'obs-websocket-js'

import { config } from '@/core'

export class StreamService {
  constructor() {
    this.obs = new OBSWebSocket()
  }

  async connect() {
    await this.obs.connect({
      address: config.obs
    })
  }

  disconnect() {
    this.obs.disconnect()
  }

  async startRecording() {
    await this.obs.send('StartRecording')
  }

  async stopRecording() {
    await this.obs.send('StopRecording')
  }

  async listRecords() {}

  async switchScene(name) {
    await this.obs.send('SetCurrentScene', { 'scene-name': name })
  }

  listScenes() {
    return this.obs.send('GetSceneList')
  }
}
