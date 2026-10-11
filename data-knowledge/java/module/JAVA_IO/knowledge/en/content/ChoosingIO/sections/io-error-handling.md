I/O communicates with systems outside ordinary Java memory, so failure is a normal part of its contract: a file may be missing, permission denied, disk full, connection closed, path replaced, or an option unsupported by the filesystem.

`IOException` and subtypes such as `NoSuchFileException` and `AccessDeniedException` let code distinguish causes when the policy really differs:

~~~java
try {
    return Files.readString(path, StandardCharsets.UTF_8);
} catch (NoSuchFileException e) {
    // Application policy may use a default, report a clear
    // "missing file" result, or propagate the exception.
    throw e;
}
~~~

The important point is **not to silently turn “file missing” into an empty string**, because that makes “missing” indistinguishable from “present but empty.” Catch a failure when the code has a meaningful decision for it. Catching `IOException` and silently ignoring it often turns an I/O failure into missing data or a difficult-to-diagnose state.

Another central rule is that **failure does not imply “nothing happened.”** I/O may have progressed partially:

~~~text
write 100 KB
→ 40 KB was written
→ failure occurs
→ the target may already have changed
~~~

Channel APIs expose partial progress directly through return values. The following loop assumes a **blocking channel**. A non-blocking channel may return `0` when it cannot currently make progress, in which case readiness handling is needed instead of spinning:

~~~java
while (buffer.hasRemaining()) {
    int written = channel.write(buffer);
    if (written <= 0) {
        throw new IOException("Blocking write made no progress");
    }
    // position advances by the amount actually written
}
~~~

Copy/move/delete operations also have filesystem-specific contracts. If an application needs publishing semantics like “readers see either the old file or the new file,” one design may write a temporary file and then request an atomic move where the filesystem supports it. `ATOMIC_MOVE` still has a support boundary: unsupported atomic movement produces `AtomicMoveNotSupportedException`, and when the target already exists, replace-versus-fail behavior can be implementation-specific. The publishing policy therefore must define what the application accepts instead of assuming `REPLACE_EXISTING` has identical semantics with an atomic move everywhere.

Retries also need semantics. Retrying a read may be straightforward; retrying a write that already progressed can duplicate data unless the code knows the target offset/state. **Idempotent** means repeating the operation still leads to the same intended final result; **resumable** means work can continue from the progress already made. Do not add a generic retry around every `IOException` without knowing whether the operation has those properties.

Resource cleanup still matters when failures occur. That is why ownership and try-with-resources from the previous chapter are part of I/O error handling, not just style.
