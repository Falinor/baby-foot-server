import axios from 'axios'

import { config } from '../core'

export class AttractionRepository {
  constructor({ playerRepository }) {
    this.playerRepository = playerRepository
    this.http = axios.create({
      baseURL: config.battlemythe.api
    })
  }

  async get() {
    const { data } = await this.http.get('/attractions/babyfoot')
    const { attraction } = data
    const players = await Promise.all(
      attraction.players.map((playerId) => this.playerRepository.get(playerId))
    )
    return fromAPI({ ...attraction, players })
  }

  async start() {
    await this.http.post('/attractions/babyfoot/start', {
      username: config.battlemythe.username,
      password: config.battlemythe.password
    })
  }

  async cancel() {
    await this.http.post('/attractions/babyfoot/cancel', {
      username: config.battlemythe.username,
      password: config.battlemythe.password
    })
  }
}

const fromAPI = (attraction) => ({
  ...attraction,
  status: attraction.status.toLowerCase()
})
