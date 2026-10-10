Failures can be grouped by lifecycle:

```text
LOOKUP
NoSuchMethodException / NoSuchFieldException
IllegalAccessException

TYPE / ADAPTATION
WrongMethodTypeException
ClassCastException on relevant conversion paths

CALL SITE TARGET UPDATE
WrongMethodTypeException
→ setTarget receives a MethodHandle whose type differs from site.type()

BOOTSTRAP / LINKAGE
BootstrapMethodError
→ non-Error bootstrap failure or null/wrong-type CallSite
Error subclass
→ propagated directly from bootstrap/resolution

CONCURRENCY / VISIBILITY
stale MutableCallSite target
VarHandle ordering misuse
```

Debug in flow order rather than adding random casts:

1. is the symbolic member identity correct?
2. does the Lookup have the required capability?
3. what is the current `MethodType`?
4. how does each adapter change the type?
5. does CallSite preserve its type invariant?
6. in multithreaded code, what visibility contract is being used?
