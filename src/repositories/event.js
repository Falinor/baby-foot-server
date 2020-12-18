import axios from 'axios'

import { config } from '../core'

export class EventRepository {
  constructor() {
    this.http = axios.create({
      baseURL: config.babyfoot.api
    })
  }

  async create(event) {
    const { data } = await this.http.post('/events', event)
    return data
  }
}
