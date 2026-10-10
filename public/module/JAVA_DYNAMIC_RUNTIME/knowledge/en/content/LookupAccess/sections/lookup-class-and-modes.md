`lookupClass()` identifies the class serving as access context. `lookupModes()` describes the remaining access capabilities. Java 21 exposes `PUBLIC`, `PRIVATE`, `PROTECTED`, `PACKAGE`, `MODULE`, `UNCONDITIONAL`, and `ORIGINAL` modes.

Two less-common modes are worth recognizing:

- `ORIGINAL`: identifies a lookup originating from the original lookup class (for example `MethodHandles.lookup()` or a VM-provided bootstrap lookup); transformations drop this mode;
- `UNCONDITIONAL`: used by `publicLookup()` for public access to unconditionally exported packages without depending on readability from a particular caller module.

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();

System.out.println(lookup.lookupClass());
System.out.println(lookup.lookupModes());
```

Capabilities can be **reduced** when a lookup moves into another context. Therefore the useful questions are:

```text
where was this Lookup created?
→ what is its lookup class?
→ which modes remain?
→ what are the package/module relationships?
```

Module boundaries matter on modern Java. A member may be public while package/module readability or openness still prevents the required lookup operation.
