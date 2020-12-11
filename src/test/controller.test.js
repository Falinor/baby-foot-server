import { Commands } from '../commands'
import { createController } from '../controller'

describe('Unit | Controller', () => {
  let matchRepository
  let controller
  let socket
  let store

  beforeEach(() => {
    matchRepository = { create: jest.fn() }
    socket = {
      broadcast: { emit: jest.fn() }
    }
    store = {
      dispatch: jest.fn(),
      getState: jest.fn()
    }
    controller = createController({
      matchRepository,
      socket,
      store
    })
  })

  describe('#startMatch', () => {
    const payload = {}

    beforeEach(async () => {
      matchRepository.create.mockImplementation(async () => {
        return payload
      })
      await controller.startMatch(payload)
    })

    it('should call the repository', () => {
      expect(matchRepository.create).toHaveBeenCalledWith(payload)
    })

    it('should broadcast that the match is starting', () => {
      expect(socket.broadcast.emit).toHaveBeenCalledWith(
        Commands.MATCH_START,
        payload
      )
    })
  })
})
