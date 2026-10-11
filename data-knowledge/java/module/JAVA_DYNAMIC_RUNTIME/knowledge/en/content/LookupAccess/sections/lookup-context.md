The common lookup/context operations have different purposes:

- `MethodHandles.lookup()`: a Lookup associated with the caller class;
- `MethodHandles.publicLookup()`: a restricted public-access lookup;
- `lookup.in(Target.class)`: changes lookup class while capabilities can be reduced by the rules;
- `MethodHandles.privateLookupIn(Target.class, lookup)`: requires the incoming lookup to have `MODULE` + `PRIVATE` access and creates a target lookup only when module/package relationships permit it.

```java
MethodHandles.Lookup callerLookup = MethodHandles.lookup();

MethodHandles.Lookup targetLookup =
        MethodHandles.privateLookupIn(
                Target.class,
                callerLookup
        );
```

`privateLookupIn` is not a “bypass private” switch. For a target in another module, the source module must read the target module and the target package must be opened appropriately. The resulting lookup uses the target as its lookup class, records the source as `previousLookupClass()`, and loses `MODULE` access during the cross-module teleport.

Framework code that needs non-public members should reason about these capabilities before reaching for broad JVM flags or opening modules indiscriminately.
