import axios from 'axios'

import { config } from '../core'

export class MatchRepository {
  constructor() {
    this.http = axios.create({
      baseURL: config.babyfoot.api
    })
  }

  async find(query) {
    const { data } = await this.http.get('/matches', { params: query })
    return data
  }

  async create(match) {
    const { data } = await this.http.post('/matches', toAPI(match))
    return data
  }

  async end(match) {
    const { data } = await this.http.put(`/matches/${match.id}`, toAPI(match))
    return data
  }

  async cancel(match) {
    await this.http.delete(`/matches/${match.id}`)
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
