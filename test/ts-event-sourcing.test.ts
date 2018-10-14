import EventProcessor from '../src/EventProcessor'
import { IEventBroadcast, MiddlewareNext, MiddlewareCallback } from '../src/Interfaces'

class EventManager extends EventProcessor {
  constructor(middleware?: MiddlewareCallback<any>[]) {
    super(middleware)
  }
}

/**
 * Event Processor test
 */
describe('EventProcessor test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('EventManager is instantiable', () => {
    expect(new EventManager()).toBeInstanceOf(EventManager)
  })

  it('EventManager can subscribe', () => {
    const em = new EventManager()
    let result = null

    em.subscribe({
      domain: 'test_c',
      channel: 'b',
      callback: payload => (result = payload)
    })

    em.broadcastChannel({
      domain: 'test_c',
      channel: 'b',
      payload: {
        test: true
      }
    })

    expect(result).toEqual({
      test: true
    })

    em.broadcastChannel({
      domain: 'test_c',
      channel: 'b',
      payload: {
        test: false
      }
    })

    expect(result).toEqual({
      test: false
    })
  })

  it('EventManager can disconnect subscribers from an existing domain', () => {
    const em = new EventManager()

    expect(em.disconnectDomain(null)).toBeFalsy()
  })

  it('EventManager can disconnect subscribers from an existing domain', () => {
    const em = new EventManager()
    const cb = (payload: any) => null

    em.subscribe({
      domain: 'test_c',
      channel: 'b',
      callback: cb
    })

    em.subscribe({
      domain: 'test_c',
      channel: 'a',
      callback: cb
    })

    expect((em as any)._subscriptions[0]).toEqual({
      domain: 'test_c',
      channel: 'b',
      callback: cb
    })
    expect((em as any)._subscriptions[1]).toEqual({
      domain: 'test_c',
      channel: 'a',
      callback: cb
    })
    expect((em as any)._subscriptions.length).toEqual(2)

    em.disconnectDomain('test_c')

    expect((em as any)._subscriptions.length).toEqual(0)
  })

  it('EventManager can run middleware', () => {
    const middlewareFn = (e: IEventBroadcast<{}>, next: MiddlewareNext<{}>) => {
      next(e)
    }
    const em = new EventManager([middlewareFn])
    let resultA = null

    em.subscribe({
      domain: 'test_c',
      channel: 'a',
      callback: payload => (resultA = payload)
    })

    expect((em as any)._subscriptions.length).toEqual(1)

    em.broadcastDomain({
      domain: 'test_c',
      channel: null,
      payload: 'test'
    })

    expect(resultA).toEqual('test')
  })

  it('EventManager can broadcast to every subscriber in a domain', () => {
    const em = new EventManager()
    let resultA = null
    let resultB = null

    em.subscribe({
      domain: 'test_c',
      channel: 'a',
      callback: payload => (resultA = payload)
    })

    em.subscribe({
      domain: 'test_c',
      channel: 'b',
      callback: payload => (resultB = payload)
    })

    expect((em as any)._subscriptions.length).toEqual(2)

    em.broadcastDomain({
      domain: 'test_c',
      channel: null,
      payload: 'test'
    })

    expect(resultA).toEqual('test')
    expect(resultB).toEqual('test')
  })

  it('EventManager can unsubscribe', () => {
    const em = new EventManager()
    let resultA = null
    let resultB = null

    const subscriptionA = em.subscribe({
      domain: 'test_c',
      channel: 'a',
      callback: payload => (resultA = payload)
    })

    const subscriptionB = em.subscribe({
      domain: 'test_c',
      channel: 'b',
      callback: payload => (resultB = payload)
    })

    em.broadcastChannel({
      domain: 'test_c',
      channel: 'a',
      payload: {
        test: true
      }
    })

    expect(resultA).toEqual({
      test: true
    })

    expect(resultB).toEqual(null)

    em.broadcastChannel({
      domain: 'test_c',
      channel: 'b',
      payload: {
        test: false
      }
    })

    expect(resultA).toEqual({
      test: true
    })

    expect(resultB).toEqual({
      test: false
    })

    expect((em as any)._subscriptions.length).toEqual(2)

    subscriptionA.unsubscribe()

    expect((em as any)._subscriptions.length).toEqual(1)
    expect((em as any)._subscriptions[0].channel).toEqual('b')
  })
})
