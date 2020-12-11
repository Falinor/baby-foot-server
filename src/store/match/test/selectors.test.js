import { config } from '../../../core'
import { Status } from '../../status'
import { isOver, isPlaying } from '../selectors'

describe('Unit | Selector | Match', () => {
  describe('#isPlaying', () => {
    it(`should return true if the match is ${Status.PLAYING}`, () => {
      const actual = isPlaying({ status: Status.PLAYING })
      expect(actual).toBe(true)
    })
  })

  describe('#isOver', () => {
    it('should return true if the match is over', () => {
      const actual = isOver({
        status: Status.PLAYING,
        teams: [{ points: config.maxPoints }, { points: config.maxPoints - 1 }]
      })
      expect(actual).toBe(true)
    })
  })
})
