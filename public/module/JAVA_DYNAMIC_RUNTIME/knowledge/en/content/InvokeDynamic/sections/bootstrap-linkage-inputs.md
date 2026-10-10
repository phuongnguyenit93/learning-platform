The core inputs are:

- `Lookup`: access context of the class containing the dynamic call site;
- `name`: symbolic operation name supplied by the class file/caller;
- `MethodType`: descriptor of the dynamic call site.

Static bootstrap arguments carry additional configuration encoded in the class file. They are **loadable constant-pool values** such as primitive/String constants, `Class`, `MethodHandle`, or `MethodType`; some values may themselves require dynamic resolution before bootstrap receives them.

```text
caller class
   ↓ Lookup

symbolic operation
   ↓ name

call contract
   ↓ MethodType

loadable constant-pool values
   ↓ static args

bootstrap policy
   ↓
CallSite
```

Lookup matters because bootstrap code often needs to resolve members using the caller's access context, not arbitrary bootstrap implementation privileges.
