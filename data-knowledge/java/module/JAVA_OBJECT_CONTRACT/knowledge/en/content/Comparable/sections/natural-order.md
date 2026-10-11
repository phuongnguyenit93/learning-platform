`Comparable<T>` requires:

```java
int compareTo(T other);
```

`Comparable` publishes a **total order** over valid comparable values of the type: for two comparable values, the ordering must place one before the other or place them in the same ordering equivalence class. A natural order should be a default ordering users of the type can reasonably predict.

For example, a `Version` can naturally order by:

```text
major
  ↓ if equal
minor
  ↓ if equal
patch
```

```java
record Version(int major, int minor, int patch)
        implements Comparable<Version> {

    @Override
    public int compareTo(Version other) {
        int byMajor = Integer.compare(major, other.major);
        if (byMajor != 0) return byMajor;

        int byMinor = Integer.compare(minor, other.minor);
        if (byMinor != 0) return byMinor;

        return Integer.compare(patch, other.patch);
    }
}
```

### WHEN SHOULD A TYPE NOT HAVE A NATURAL ORDER?

If several orderings are equally meaningful, choosing one arbitrarily can surprise users.

A `Book` may be ordered by title, publication date, price, or rating. None is necessarily the one intrinsic order of the type. In that case, external `Comparator` policies are often better.
