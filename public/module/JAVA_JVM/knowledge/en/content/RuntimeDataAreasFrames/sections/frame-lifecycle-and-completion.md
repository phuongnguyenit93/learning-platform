A frame is created each time a method is invoked and destroyed when the invocation completes.

Completion can be:

- **normal**: the method returns normally, optionally returning a value to its caller;
- **abrupt**: the method throws an exception that is not handled within that invocation.

When an exception propagates, the current frame may be discarded while the runtime searches caller frames for a matching handler.

```text
caller frame
   ↓ invokes
callee frame
   ├─ normal return → result to caller
   └─ uncaught exception → discard callee frame, propagate
```

Frame lifecycle is therefore tightly connected to both call-stack behavior and exception propagation.
