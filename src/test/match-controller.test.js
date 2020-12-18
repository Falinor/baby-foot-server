import { createMatchController, rotateScenes } from '../match-controller'
import { StreamingRepository } from '../repositories'

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
    controller = createMatchController({
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
  })

  it('should rotate scenes', async () => {
    const streamingRepository = new StreamingRepository()
    await streamingRepository.connect()
    const scenes = await streamingRepository.listScenes()
    console.log(scenes)
  })
})
