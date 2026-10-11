Native-library problems can fail at several distinct layers. Separating them makes diagnosis much easier.

~~~text
file cannot be found
→ loading failure

file exists but architecture/dependency is wrong
→ loader/linker failure

library loads but expected symbol is missing
→ symbol-resolution failure

symbol exists but descriptor/ABI is wrong
→ call-boundary failure, potentially a crash
~~~

JNI commonly surfaces loading or binding problems through UnsatisfiedLinkError. With FFM, SymbolLookup.find may simply fail to produce the expected symbol. The operating-system loader can also report missing native dependencies or an invalid binary format.

When debugging, record the library path/name, OS and CPU architecture, native dependencies, and expected symbol/version instead of collapsing everything into “native call failed.”
