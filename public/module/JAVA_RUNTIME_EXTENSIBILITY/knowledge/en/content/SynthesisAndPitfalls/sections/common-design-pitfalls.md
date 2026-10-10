Common design pitfalls include:

1. **Host directly requires/imports providers** → extension decoupling disappears.
2. **Discovery order becomes priority** → behavior depends on deployment topology.
3. **Provider constructors perform heavy work** → discovery creates uncontrolled side effects.
4. **No missing-provider policy** → failures occur late.
5. **Too many shared dependencies** → version conflicts.
6. **Each plugin loads its own contract copy** → type-identity failures.
7. **Calling `reload()` is treated as class unloading** → loader/resource leaks remain.
8. **Threads, ThreadLocals, or listeners are not cleaned up** → old plugin generations stay reachable.
9. **SPI changes lack compatibility tests** → breakage appears only during deployment.
10. **A ModuleLayer design still hard-codes provider modules into the host** → complexity without real extensibility.

A design review should surface these questions before the implementation becomes expensive to change.
