“Generics are invariant” does **not** mean generic classes and interfaces lose their declared inheritance relationships.

If the declarations are related:

```java
interface Container<T> {}

class ArrayContainer<T> implements Container<T> {}
```

then the subtype relation is preserved for the **same type argument**:

```java
ArrayContainer<String> child = new ArrayContainer<>();
Container<String> parent = child; // OK
```

What invariance rejects is inventing a subtype relationship merely because the **type arguments** are related:

```text
Dog <: Animal

but

Container<Dog> </: Container<Animal>
```

Keep both ideas together:

```text
declared inheritance still works
+
type-argument inheritance does not automatically transfer through a generic type
```

### MINIMAL `List<E>` MENTAL MODEL USED FROM THIS POINT ON

The Collection module comes immediately after Generics, so this module does **not** teach List implementations or performance here. For now, treat:

```text
List<E>
→ a container holding many E values

get(...)
→ read an E

add(E)
→ write an E

size()
→ read the number of elements
```

From this point on, the Invariance/Wildcard/PECS examples use only this minimal read/write model.
