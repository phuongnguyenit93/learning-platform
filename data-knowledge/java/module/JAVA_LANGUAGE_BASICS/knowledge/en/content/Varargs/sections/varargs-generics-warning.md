> This is an advanced boundary with the Generics module. Beginners can retain the risk and revisit the mechanism after learning type erasure and reifiable types.

Varargs uses arrays while generic type parameters are erased. Combining the mechanisms can produce heap-pollution warnings for non-reifiable types.

`@SafeVarargs` is a promise that the implementation uses the varargs array safely; it should not be used merely to silence a warning.

Arrays carry runtime component-type behavior while generic parameters are erased. A generic varargs array therefore cannot fully represent parameterization such as `List<String>[]` at runtime, and unsafe writes/aliases can produce heap pollution.

Practical rules: prefer collections when the variable-size input is a real data structure; use varargs for clear call-site ergonomics; do not perform unsafe writes or expose a generic varargs array to code that can corrupt it; use `@SafeVarargs` only when the implementation is actually safe.

The next chapter asks exactly what gets copied when arguments enter a method.
