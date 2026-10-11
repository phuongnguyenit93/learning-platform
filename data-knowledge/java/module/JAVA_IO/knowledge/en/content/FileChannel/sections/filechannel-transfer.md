When the goal is simply to move bytes between channels, application code may not need to copy every chunk through its own `ByteBuffer`. `FileChannel` provides:

~~~java
long moved = source.transferTo(position, count, target);
~~~

and:

~~~java
long moved = target.transferFrom(source, position, count);
~~~

Some JVM/operating-system combinations can optimize this data path and reduce copying through user space. That is an optimization opportunity, not a promise that every environment uses zero-copy.

The correctness rule matters more: **a single transfer may move fewer bytes than requested**. Always use the returned count:

~~~java
long position = 0;
long size = source.size();

while (position < size) {
    long moved =
            source.transferTo(position, size - position, target);

    if (moved <= 0) {
        throw new IOException("Transfer made no progress");
    }

    position += moved;
}
~~~

The point is that `moved == 0` must not be interpreted as “the copy is complete.” For a target type that can temporarily make no progress, a real policy may retry or fall back; in this blocking file-to-file example, reporting a no-progress failure avoids an infinite loop and avoids returning a silently incomplete copy.

For ordinary file copying, `Files.copy` is often simpler and communicates intent better. `transferTo/transferFrom` becomes more relevant when the code already operates at channel level or profiling shows the transfer path is worth optimizing.
