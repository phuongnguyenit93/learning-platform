Avoid mechanical slogans such as:

```text
business exception = checked
modern Java = unchecked
```

Start from the caller's responsibility.

### DESIGN QUESTIONS

```text
Can and should the caller meaningfully handle this failure?
        ↓
Should every caller be forced to decide at compile time?
        ↓
Does the throws clause make the API clearer or merely noisier?
        ↓
Is this a recoverable operational condition,
or a violated contract/invariant?
```

The same “cannot read data” problem may lead to different policies:

```text
desktop tool reads a user-selected file
→ IOException may let the caller ask the user to choose another file

internal service calls a repository
→ the service may translate it into an application exception
  and handle it at a higher boundary
```

There is no universal choice. The exception category should serve the API's **handling policy**.

### COMPILE-TIME COMPARISON

```java
void checked() throws IOException {
    throw new IOException("disk failure");
}

void unchecked() {
    throw new IllegalStateException("invalid state");
}
```

Callers of `checked()` must catch or declare `IOException`. Callers of `unchecked()` are not forced to do so.

### REMEMBER

```text
checked
→ compiler forces the failure into the caller's decision

unchecked
→ compiler does not force that decision, but the runtime failure still exists
```

The next chapter separates two easily confused keywords: `throw` actually raises a throwable at runtime, while `throws` declares that an exception may escape a method.
