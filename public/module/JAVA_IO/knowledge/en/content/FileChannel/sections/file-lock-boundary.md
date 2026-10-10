A **file lock** is a coordination request to the operating system/filesystem that marks a whole file or byte region as being held under an agreed access rule by a JVM/process. Its main role is to help **multiple processes coordinate access to the same file** when the participating programs honor the locking protocol.

The two common modes are:

- an **exclusive lock**, which requests sole conflicting access to the region so another conflicting lock should not coexist;
- a **shared lock**, which allows compatible shared holders on the region when the platform supports shared locking, while still conflicting with an exclusive lock.

A requested shared lock **may be converted to an exclusive lock** on a platform that does not support shared locks. If the actual acquired mode matters, inspect `FileLock.isShared()` rather than assuming the requested boolean was preserved.

A `FileChannel` can request a lock over a file region:

~~~java
try (FileLock lock = channel.lock()) {
    // work coordinated through the file lock
}
~~~

Code can also lock a range and request shared/exclusive behavior:

~~~java
try (FileLock lock =
             channel.lock(position, size, false)) {
    // false requests an exclusive lock
}
~~~

With that coordination role established, the boundaries still matter:

- Java file locks are held on behalf of the **entire JVM**, not as a monitor for one Java thread. They are not the mechanism for coordinating threads inside the same JVM.
- Operating systems and filesystems differ in how strongly they enforce locks and whether other software treats them as advisory. For portable correctness, treat locking as a coordination protocol that participating processes must honor.
- Overlapping locks in the same JVM can cause `OverlappingFileLockException`.
- On some systems, closing one channel for a file can release **all locks held by the JVM on that underlying file**, including locks acquired through another channel. Portable code should not assume each channel's file-lock lifetime is always isolated from other channels opened on the same file.
- A lock does not turn multiple file operations into a database transaction or business transaction.
- A `FileLock` has a lifetime and must be released, typically with try-with-resources.

`tryLock()` lets code attempt acquisition without waiting:

~~~java
FileLock lock = channel.tryLock();

if (lock != null) {
    try (lock) {
        // protected work
    }
}
~~~

If the real problem is distributed coordination among services, a transaction across several resources, or business-level consistency, file locking is the wrong abstraction. Its scope is coordination around a file/channel.
