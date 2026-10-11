When several exception types genuinely share the **same handling policy**, Java supports:

```java
try {
    importData();
} catch (IOException | SQLException ex) {
    auditAndAbort(ex);
}
```

### WHY?

Without multi-catch, code can duplicate the same handler:

```java
catch (IOException ex) {
    auditAndAbort(ex);
} catch (SQLException ex) {
    auditAndAbort(ex);
}
```

### Alternatives may not be subtype-related

This is invalid:

```java
catch (FileNotFoundException | IOException ex) {
    ...
}
```

because `FileNotFoundException` is already a subtype of `IOException`.

### Do not merge failures merely to save lines

If policies differ:

```text
FileNotFoundException
→ ask for another file

SQLException
→ report storage unavailable
```

then combining them because today's handler body looks similar loses meaning.

After understanding how one or several exception types are caught, the next part examines `finally`: what work still has to happen when control leaves `try/catch`?
