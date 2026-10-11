`@Around` is not merely "before + after inside one method". It is advice that can control the invocation itself.

Safe mental model:

```text
proceed()
→ continue the call chain

no proceed()
→ the chain stops at the current advice
```
