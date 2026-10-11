`AsynchronousFileChannel` is still a file-oriented channel, but its read/write operations are **initiated and then completed asynchronously** instead of requiring the caller to wait at the `read` or `write` call itself.

Unlike `FileChannel`, this API does not center on one mutable shared file position. Each read or write names an explicit file offset:

~~~java
try (AsynchronousFileChannel channel =
             AsynchronousFileChannel.open(path, StandardOpenOption.READ)) {
    ByteBuffer buffer = ByteBuffer.allocate(4096);
    Future<Integer> pending = channel.read(buffer, 0);

    // The program can do other work here.
    int read = pending.get();
}
~~~

`Future<Integer>` is one completion style. Calling `get()` waits when the operation has not completed yet, so code that immediately calls `get()` after `read(...)` gives up most of the benefit of separating initiation from waiting.

The API also supports `CompletionHandler`, where Java invokes a callback after the operation succeeds or fails:

~~~java
channel.read(buffer, 0, null,
        new CompletionHandler<Integer, Void>() {
            @Override
            public void completed(Integer count, Void ignored) {
                // use the result after the read completes
            }

            @Override
            public void failed(Throwable error, Void ignored) {
                // handle failure
            }
        });
~~~

Writes offer the same two styles and also use an explicit file position. As with synchronous channels, the completed byte count may be smaller than the buffer's remaining data, so multi-step logic must follow the actual count/`position` rather than assume one operation handled the entire payload.

Lifecycle remains explicit: `AsynchronousFileChannel` is `AutoCloseable`; its owner must keep the channel open for the operations the application still needs and close it when use ends. Closing the channel while operations are still outstanding causes those operations to complete with `AsynchronousCloseException`. Code must also avoid modifying or reusing a `ByteBuffer` region participating in an asynchronous operation until that operation has completed under the application's contract.

Several reads/writes may be outstanding at the same time. Their I/O completion order and the order in which their `CompletionHandler` callbacks run are **not specified** and are not guaranteed to match initiation order. Algorithms that require ordering must impose that ordering explicitly rather than infer it from call order.

Cancellation is also an I/O concern, not just a generic `Future` concern. Calling `cancel(true)` may interrupt an operation by **closing the channel**; in that case other outstanding operations on the same channel can fail with `AsynchronousCloseException`. Cancellation is implementation-sensitive when the runtime cannot prove whether bytes were already read or written, so cancelled-operation buffers/state must not be treated as if “nothing happened.”

A useful selection boundary is:

~~~text
FileChannel
→ caller performs blocking/synchronous file I/O
→ control flow is usually simpler

AsynchronousFileChannel
→ operations may complete later
→ useful when the architecture can actually do other work while I/O is pending
→ completion, cancellation, and coordination become part of the design
~~~

Asynchronous I/O is not automatically faster and does not automatically solve concurrent access. When operations overlap on the same file region or in-memory data, the application still needs an explicit coordination policy. Executors, callback composition, cancellation, memory visibility, and deeper concurrency models belong in the concurrency module; the core concern here is the asynchronous I/O contract and the lifetime of the channel and buffers.

After `FileChannel` and `AsynchronousFileChannel`, we have seen many objects tied to resources outside the JVM: streams, channels, directory streams, and file locks. The next chapter focuses on a design question more important than syntax: **who owns the resource, and when must it be closed?**
