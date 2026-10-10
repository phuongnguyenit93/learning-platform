The most important rule is:

```text
if a.equals(b) == true
→ a.hashCode() must equal b.hashCode()
```

The reverse is not required:

```text
same hash code
↛ necessarily equal
```

Unequal objects may collide and produce the same hash code.

Repeated calls must also remain consistent while the state relevant to equality remains unchanged.

The contract does not require the same object to keep the same hash value across separate JVM executions. Do not persist `hashCode()` as a durable identifier and expect to reuse it in another process.

### DEFAULT `Object.hashCode()`

If a class does not override `hashCode`, the inherited implementation is compatible with identity-based equality from `Object`. Once logical equality is changed by overriding `equals`, the inherited hash behavior may no longer satisfy the new equality relation.

That is why the practical design rule is:

```text
override equals
→ review/override hashCode as part of the same design change
```

### HOW SHOULD `hashCode` BE IMPLEMENTED?

The hard requirement is behavioral: **every pair of objects that `equals` considers equal must produce the same hash code**. A straightforward way to achieve that is to derive `hashCode` from the same equality-relevant state as `equals`.

```java
@Override
public int hashCode() {
    return Objects.hash(value);
}
```

With multiple fields:

```java
@Override
public int hashCode() {
    return Objects.hash(countryCode, number);
}
```

`Objects.hash` favors readability. Performance-sensitive code may choose another calculation, but the equality contract must remain the same.

Using every equality field is not itself a contract requirement. For example, if `equals` compares `countryCode + number`, a `hashCode` based only on `countryCode` can still be correct because equal objects still hash alike. It is usually a poor design, however, because many unequal objects produce the same hash and force the collection to examine more candidates.

```text
required for correctness
→ equal objects must have equal hashes

useful for distribution
→ include enough equality-relevant state to spread unequal values reasonably
```
