import EventProcessor from "../src/EventProcessor";

class EventManager extends EventProcessor {
  constructor() {
    super();
  }
}

/**
 * Dummy test
 */
describe("Dummy test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy()
  })

  it("EventManager is instantiable", () => {
    expect(new EventManager()).toBeInstanceOf(EventManager)
  })

  it("EventManager can create domains", () => {
    const em = new EventManager();
    em.connect({
      domain: 'test_c',
      channels: ['a', 'b']
    });
    expect(em.domains[0]).toEqual({
      domain: 'test_c',
      channels: ['a', 'b']
    });
  })

  it("EventManager can create subscribe", () => {
    const em = new EventManager();
    let result = null;
    const expectedResult = {
      test: true
    };

    em.subscribe({
      domain: 'test_c',
      channel:  'b',
      callback: (payload) => result = payload
    });

    em.broadcast({
      domain: 'test_c',
      channel:  'b',
      payload: {
        test: true
      }
    })

    expect(result).toEqual(expectedResult);
  })
})
