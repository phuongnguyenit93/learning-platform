When a method is redefined/retransformed while an invocation is already executing, the JVM **does not migrate the active stack frame to new bytecode mid-call**.

~~~text
Thread A enters OrderService.placeOrder()
        ↓
old bytecode is executing

Thread B triggers retransform
        ↓
new definition installed

Thread A
→ continues old bytecode for that invocation

new invocation
→ uses new bytecode
~~~

For a short period, an old invocation and new invocations can therefore execute different method versions.

Agent/probe logic must tolerate that transition. “retransform returned” does not mean every active stack frame is now executing the new code.
