Java does not require programmers to treat references as manipulable physical memory addresses.

A sufficient mental model is:

```text
reference value
→ identifies an object/array
→ can be copied
→ can be compared for identity with ==
→ can be dereferenced
→ can be null
```

Several references may alias the same object. Losing one reference does not destroy the object while another reachable path remains.

### Aliasing, identity, and assignment

```java
User a = new User("A");
User b = a;
User c = new User("A");
```

`a` and `b` are different variables that identify the same object. `c` identifies a different object even if its state initially looks equal.

Reference assignment does **not clone** an object:

```java
User original = new User("A");
User alias = original;
```

The second line copies only the reference value. Independent state requires an explicit copy strategy chosen by the API/design.

The next chapter asks where variables are visible and how variable lifetime differs from object lifetime.
