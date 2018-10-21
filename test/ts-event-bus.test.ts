import { EventBus } from '../src/EventBus'
import { DomainEvent } from '../src/DomainEvent'
import { IDomainEvent } from '../src/IDomainEvent'
import { MiddlewareNext } from '../src/types'

/**
 * Event Bus test
 */
describe('EventBus test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('EventBus is instantiable', () => {
    expect(new EventBus()).toBeInstanceOf(EventBus)
  })

  it('EventBus can subscribe', () => {
    const em = new EventBus()
    let result = null

    em.register({
      channel: 'b',
      callback: payload => (result = payload)
    })

    em.trigger(
      new DomainEvent<{}>('b', {
        test: true
      })
    )

    expect(result).toEqual({
      test: true
    })

    em.trigger(
      new DomainEvent<{}>('b', {
        test: false
      })
    )

    expect(result).toEqual({
      test: false
    })
  })

  it('EventBus can disconnect subscribers from an non existing domain', () => {
    const em = new EventBus()

    expect(em.unregister(null)).toBeFalsy()
  })

  it('EventBus can disconnect subscribers from an existing domain', () => {
    const em = new EventBus()
    const cb = (payload: any) => null

    em.register({
      channel: 'b',
      callback: cb
    })

    em.register({
      channel: 'a',
      callback: cb
    })

    expect((em as any)._subscriptions[0]).toEqual({
      channel: 'b',
      callback: cb
    })
    expect((em as any)._subscriptions[1]).toEqual({
      channel: 'a',
      callback: cb
    })
    expect((em as any)._subscriptions.length).toEqual(2)

    em.unregister('a')
    expect((em as any)._subscriptions.length).toEqual(1)
    em.unregister('b')

    expect((em as any)._subscriptions.length).toEqual(0)
  })

  it('EventBus can run middleware', () => {
    const logs = []
    const middlewareFn = (e: IDomainEvent<{}>, next: MiddlewareNext<{}>) => {
      logs.push(new DomainEvent<{}>(e.channel, e.payload).toJSON())
      next(e)
    }
    const em = new EventBus([middlewareFn])
    let resultA = null

    em.register({
      channel: 'a',
      callback: payload => (resultA = payload)
    })

    expect((em as any)._subscriptions.length).toEqual(1)

    em.trigger(new DomainEvent<{}>('a', 'test 1'))

    em.trigger(new DomainEvent<{}>('a', 'test 2'))

    em.trigger(new DomainEvent<{}>('a', 'test 3'))

    expect(resultA).toEqual('test 3')
    expect(logs[0].payload).toEqual('test 1')
    expect(logs[1].payload).toEqual('test 2')
    expect(logs[2].payload).toEqual('test 3')
  })

  it('EventBus can broadcast to every subscriber in a channel', () => {
    const em = new EventBus()
    let resultA = null
    let resultB = null

    em.register({
      channel: 'a',
      callback: payload => (resultA = payload)
    })

    em.register({
      channel: 'a',
      callback: payload => (resultB = payload)
    })

    expect((em as any)._subscriptions.length).toEqual(2)

    em.trigger(new DomainEvent<{}>('a', 'test'))

    expect(resultA).toEqual('test')
    expect(resultB).toEqual('test')
  })

  it('EventBus can unsubscribe', () => {
    const em = new EventBus()
    let resultA = null
    let resultB = null

    const subscriptionA = em.register({
      channel: 'a',
      callback: payload => (resultA = payload)
    })

    const subscriptionB = em.register({
      channel: 'b',
      callback: payload => (resultB = payload)
    })

    em.trigger(
      new DomainEvent<{}>('a', {
        test: true
      })
    )

    expect(resultA).toEqual({
      test: true
    })

    expect(resultB).toEqual(null)

    em.trigger(
      new DomainEvent<{}>('b', {
        test: false
      })
    )

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
