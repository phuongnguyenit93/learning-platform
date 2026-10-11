After a `String` object is created, operations do not mutate its character sequence in place.

### WHAT — what is immutable?

Separate three ideas that are often casually called “the String”:

```text
String variable
→ stores a reference

String object
→ immutable object referenced by the variable

String value
→ the text content represented by that object
```

Immutability applies to the object/value. It does not mean a variable holding a String reference can never be reassigned.

```java
String s = "java";
s.toUpperCase();
System.out.println(s); // java
```

`toUpperCase()` returns another String value when content must change.

```text
s ─────────────► "java"

s = s.toUpperCase()

s ─────────────► "JAVA"
```

The variable now refers to the result; the object representing `"java"` was not mutated into `"JAVA"`.

Immutability enables safe sharing, stable hashing, literal pooling, and simpler aliasing rules.

Those benefits connect directly to the rest of the module:

```text
immutable
→ safe sharing
→ pooling / intern can share identity

immutable
→ stable content
→ equals/hashCode remain stable

immutable
→ repeated construction does not modify an old String
→ concatenation and StringBuilder matter
```

### HOW — how is the contract exposed?

`String` has no public API that changes one code unit in place. Text transformations return a `String` result.

Do not build the mental model around an assumed internal field such as `char[]`. The JVM implementation has changed across Java versions. Application code should depend on this contract:

```text
current String
        │
        ├── inspect/search
        │      → value unchanged
        │
        └── transform
               → receive a String result
```

### Copy boundaries with mutable char[]

Immutability must also hold when a String is created from externally mutable data:

```java
char[] chars = {'j', 'a', 'v', 'a'};
String text = new String(chars);

chars[0] = 'J';

System.out.println(text); // java
System.out.println(chars); // Java
```

Mutating the source array after construction does not change the String. If String kept a mutable alias to the caller's array, the immutability contract would be broken.

The reverse direction also returns an independent mutable copy:

```java
String text = "java";
char[] copy = text.toCharArray();

copy[0] = 'J';

System.out.println(text);             // java
System.out.println(new String(copy)); // Java
```

Mental model:

```text
mutable char[] input
        ↓ copy boundary
immutable String value
        ↓ copy boundary
mutable char[] output
```

The important contract is that application code does not receive a mutable-array alias that can modify an existing String's content. String's actual internal representation remains a JVM implementation detail.
