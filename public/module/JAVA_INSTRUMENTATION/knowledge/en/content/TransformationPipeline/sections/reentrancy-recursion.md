A transformer runs inside the class-definition path, so code it calls can accidentally trigger more class loading.

Example:

~~~text
transform OrderService
→ first use of logger
→ load logger implementation
→ transformer sees logger class
→ transformation code logs again
→ recursive loading / dependency problem
~~~

The API excludes some definitions of classes upon which a registered transformer depends, but agent design must still prevent broader recursion.

Useful techniques:

- initialize critical helpers before registering the transformer;
- denylist agent/tooling packages;
- keep the transform path lightweight and dependency-poor;
- use a ThreadLocal/reentrancy guard when appropriate;
- avoid network I/O or heavy initialization inside callbacks when possible.

Class loading is a concurrent, reentrant environment. Treat transformer code as runtime infrastructure, not as an ordinary request handler.
