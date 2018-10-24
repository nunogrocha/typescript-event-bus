# TypeScript Event Bus


## Main Features
 * Typed interfaces and callbacks
 * Middleware
 * No external dependencies (e.g. rxjs)
 
## Install
```
npm i -S @nunogcrocha/typescript-event-bus
```

## Example Usage
```
// Instanciate it with or without middleware
const eb = new EventBus();
// or
const middlewareFn = (e: IDomainEvent<{}>, next: MiddlewareNext<{}>) => {
  logs.push(new DomainEvent<{}>(e.channel, e.payload).toJSON())
  next(e)
}
const eb = new EventBus([middlewareFn]);

// Register event handlers
eb.register({
  channel: 'b',
  callback: payload => console.log("payload", payload)
});

// Emit events
eb.trigger(
  new DomainEvent<{}>('b', {
    test: true
  })
);

// Clear handlers
eb.unregister('b');
// or
eb.unregisterAll();
```
