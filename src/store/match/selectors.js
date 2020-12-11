import { config } from '../../core'
import { Status } from '../status'

export const isPlaying = (state) => state.status === Status.PLAYING

export const isOver = (state) =>
  isPlaying(state) &&
  state.match.teams.some((team) => team.points === config.maxPoints)
