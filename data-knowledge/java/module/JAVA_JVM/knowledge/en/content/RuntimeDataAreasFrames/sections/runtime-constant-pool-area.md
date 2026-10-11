Each class or interface has a runtime constant pool created from information in its class-file constant pool. In the JVMS model, it belongs to method-area-level runtime state.

It connects the file representation to execution:

```text
class-file constant_pool
        ↓ class creation
runtime constant pool
        ↓ resolution/execution
runtime behavior
```

That is why the constant pool appears in both the class-file chapter and the runtime-data chapter: the concept has **two lifecycle representations**.
