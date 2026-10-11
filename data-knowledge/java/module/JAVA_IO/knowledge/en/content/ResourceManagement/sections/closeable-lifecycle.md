Java models “can be closed” with `AutoCloseable`:

~~~java
public interface AutoCloseable {
    void close() throws Exception;
}
~~~

`Closeable` is the common I/O specialization. It extends `AutoCloseable` and its `close()` contract uses `IOException`.

Familiar types such as `InputStream`, `OutputStream`, `Reader`, `Writer`, `FileChannel`, `DirectoryStream`, and `FileLock` all have a lifetime that matters according to their API contract.

The useful mental model is:

~~~text
new/open
→ an external resource is acquired

Java object is still usable
→ the external resource may still be held

close
→ use ends and the resource is released according to its contract
~~~

After close, do not continue using the resource unless the API explicitly says an operation remains valid. Most operations on closed streams/channels fail.

`Closeable.close()` is specified so repeated close calls have no further effect. That is not a general requirement for every `AutoCloseable` implementation. A clearer design still has **one owner** responsible for closing the resource once in the normal lifecycle.
