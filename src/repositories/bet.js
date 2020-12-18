import axios from 'axios'

import { config } from '../core'

export class BetRepository {
  constructor() {
    this.http = axios.create({
      baseURL: config.babyfoot.api
    })
  }

  async create(bet) {
    const { data } = this.http.post('/bets', toAPI(bet))
    return data
  }

  async accept(bet) {
    const { data } = await this.http.post(`/bets/${bet.bet}/takers`, {
      taker: bet.taker
    })
    return data
  }
}

const toAPI = (bet) => bet
