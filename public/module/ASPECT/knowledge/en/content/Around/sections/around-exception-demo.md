Controller:

```text
AroundAdviceController#exceptionPropagation()
```

Endpoint:

```text
GET /aop/around/exception
```

The target intentionally throws:

```text
IllegalStateException("intentional-around-demo-error")
```

The Aspect observes the exception but **rethrows** it instead of swallowing it:

```text
around:exception-before-proceed
target:throwsFailure
around:exception-observed=IllegalStateException
around:exception-finally
```

The lesson is:

```text
catching an exception in @Around
≠
having to turn that exception into success
```

Preserving propagation is usually less surprising when the Aspect is only performing logging, metrics, or auditing.

---

### What about calling proceed() multiple times?

Technically, `@Around` can alter control flow deeply, but this module does not present multiple calls to `proceed()` as a recommended pattern. Doing so can execute the target multiple times and duplicate side effects.

Remember that `proceed()` means **continue the invocation chain**. It is not a harmless callback that can be invoked arbitrarily.

---
