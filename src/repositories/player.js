import axios from 'axios'

import { config } from '../core'

export class PlayerRepository {
  constructor() {
    this.http = axios.create({
      baseURL: config.babyfoot.api
    })
  }

  async find(options = {}) {
    const { data: players } = await this.http.get('/players')
    return players
  }

  async get(id) {
    const { data: player } = await this.http.get(`/players/${id}`)
    return player
  }
}
