# Handling Exceptions with try/catch/finally

Propagation lets failures move upward. `try/catch/finally` lets a layer make three different decisions:

```text
try
→ execution that may fail

catch
→ handle a particular failure category

finally
→ perform mandatory work when leaving the try/catch region
```

The difficult part is not the syntax. It is the **control-flow order** when success, exceptions, `return`, and cleanup interact.
