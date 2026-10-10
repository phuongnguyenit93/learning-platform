Arrays have a runtime array type, a fixed `length`, zero-based indexes, and element default values based on the component type.

The array itself is an object and can be shared through several references or set to `null`. A null array reference is different from an existing reference array whose elements start as null:

```java
String[] a = null;          // no array object
String[] b = new String[1]; // array exists; b[0] == null
int[] empty = new int[0];   // a real array object with length 0
```

Null and an empty array are different states: `null` identifies no array object, while `new int[0]` creates a valid array object that simply contains no elements.

Declaration and creation are separate operations:

```java
int[] a;
a = new int[3];
```

`length` is a fixed array property after creation; arrays do not have a `length()` method.

Arrays are mutable objects, and assigning one array variable to another copies only the reference:

```java
int[] first = {1, 2};
int[] second = first;
second[0] = 99;
```
