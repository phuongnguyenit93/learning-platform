Precise rethrow handles a subtle case: code catches a broad type to perform shared logic, but the compiler can still preserve the narrower checked types that can actually reach that catch.

Example:

```java
void process() throws IOException, SQLException {
    try {
        readFileOrQueryDatabase();
    } catch (Exception ex) {
        audit(ex);
        throw ex;
    }
}
```

Assume the `try` body can only throw `IOException` or `SQLException`. If `ex` is not reassigned, the compiler can infer that rethrowing it only produces those checked types.

The method does **not** need to broaden its contract to:

```java
throws Exception
```

### WHY?

Without precise rethrow, catching a supertype for shared logic could unnecessarily widen the public contract.

Mental model:

```text
catch parameter is broad
        ↓
compiler analyzes the checked types that can actually reach it
        ↓
the parameter is not reassigned
        ↓
rethrow keeps the narrower type set
```

Multi-catch:

```java
catch (IOException | SQLException ex) {
    throw ex;
}
```

also keeps an explicit narrow type set, but that is **multi-catch**. Precise rethrow is especially interesting when the parameter is written as a broader supertype such as `Exception` and the compiler still preserves the specific checked set.
