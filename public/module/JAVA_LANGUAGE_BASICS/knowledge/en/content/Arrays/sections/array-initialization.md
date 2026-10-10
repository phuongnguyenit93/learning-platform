Arrays can be created by length and populated later:

```java
int[] values = new int[3];
```

or created with an initializer:

```java
int[] values = {10, 20, 30};
```

Primitive elements receive primitive defaults; reference elements start as `null`. Invalid indexes fail with `ArrayIndexOutOfBoundsException` at runtime.

```java
int[] numbers = new int[2];       // [0, 0]
boolean[] flags = new boolean[2]; // [false, false]
String[] names = new String[2];   // [null, null]
```

For a reference array, a null element still fails when dereferenced:

```java
User[] users = new User[1];
users[0].getName(); // NullPointerException because users[0] == null
```

Indexed loops are useful when position or mutation matters; enhanced-for is clearer when only element values are needed.

The enhanced-for loop variable receives an element value on each iteration. Reassigning that local variable does **not** replace the array slot:

```java
int[] numbers = {1, 2, 3};
for (int number : numbers) {
    number = 0; // changes only the local loop variable
}
```

Use an index or another appropriate API when the array slot itself must change.

Enhanced-for also works with `Iterable` values such as Collections introduced later. The loop-variable rule is the same: reassigning the local loop variable does not replace the element stored in the container.

```java
List<String> items = List.of("A", "B"); // preview of a Collection API
for (String item : items) {
    item = item.toLowerCase(); // does not replace an element in items
}
```

`==` compares array reference identity rather than element contents. Use utilities such as `Arrays.equals`, `Arrays.copyOf`, or `System.arraycopy` when content comparison/copying is the real intent.

### Copying an array does not deep-copy referenced elements

For a primitive array, copying elements produces independent primitive values in the new array. For a reference array, the new array receives **copies of the element reference values**:

```java
User[] original = {
    new User("A")
};

User[] copied = Arrays.copyOf(original, original.length);

copied[0].setName("B");
System.out.println(original[0].getName()); // B
```

`original` and `copied` are different array objects, but element `0` in both arrays identifies the same `User` object:

```text
original array            copied array
┌─────────────┐            ┌─────────────┐
│ ref R ──────┼──────┐     │ ref R ──────┼──────┐
└─────────────┘      │     └─────────────┘      │
                     └────────→ User ←───────────┘
```

Therefore `Arrays.copyOf`/`System.arraycopy` copy array contents element-by-element; they do not automatically deep-copy objects referenced by those elements. Shallow/deep object-copy strategies belong to the `class-object` module.
