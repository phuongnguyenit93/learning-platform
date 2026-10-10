After studying each mechanism separately, connect them into one reasoning chain. When reading Java code, ask:

```text
Where does this code live in the program structure?
        ↓
What value and type does this expression/variable have?
        ↓
Is the name in scope here?
        ↓
Are conversion, boxing/unboxing, or null involved?
        ↓
Which operators and control-flow decisions determine execution?
        ↓
What values are stored in arrays or passed to methods?
        ↓
What has the compiler already decided?
        ↓
What still has to be checked at runtime?
```

This model is more useful than memorizing disconnected syntax because it explains both successful code and compile/runtime failures.

When reading difficult Java code, ask in order: what is the static type, is the value primitive or reference, which conversion context applies, what does the compiler decide, what remains for runtime, and is a mutation changing a local variable or shared object state?

The module's final chain is:

```text
source-code structure
→ primitive/reference values
→ variables/scope/lifetime
→ null
→ wrappers/boxing/unboxing
→ expressions/operators/casting
→ control flow
→ arrays
→ methods/varargs/pass-by-value
→ packages/imports
→ compile-time/runtime type boundaries
→ end-to-end synthesis
```
