import axios from 'axios'

import { config } from '../core'

export class PlayerRepository {
  constructor() {
    this.http = axios.create({
      baseURL: config.babyfoot.api
    })
  }

  async create(match) {
    await this.http.post('/matches', toAPI(match))
  }

  async update(match) {
    const { data } = await this.http.put(`/matches/${match.id}`, match)
    return data
  }
}

const toAPI = (match) => ({
  teams: match.teams.map((team) => ({
    points: team.points,
    color: team.color,
    name: team.name,
    players: team.players.map((player) => player.id)
  }))
})
