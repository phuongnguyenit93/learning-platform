Suppose three bytes have just been put into a buffer:

~~~text
position = 3
limit    = 8
capacity = 8
~~~

Calling `get()` now would start at index 3 instead of rereading the three bytes just written. Before consuming the data, call:

~~~java
buffer.flip();
~~~

Conceptually, `flip()` performs:

~~~text
limit = old position
position = 0
~~~

The state becomes:

~~~text
position = 0
limit    = 3
capacity = 8

[10][20][30][?][?][?][?][?]
 ^           ^
 position    limit
~~~

The readable region is now `[position, limit)`:

~~~java
while (buffer.hasRemaining()) {
    System.out.println(buffer.get());
}
~~~

After consuming all three bytes:

~~~text
position = 3
limit    = 3
~~~

If all old data has been consumed and the whole buffer should be reused for another fill cycle:

~~~java
buffer.clear();
~~~

`clear()` sets:

~~~text
position = 0
limit    = capacity
~~~

The name is easy to misread: `clear()` **does not erase or zero the old bytes**. It only resets the state so that the full region can be overwritten.

Beyond `position/limit/capacity`, a `Buffer` can also have an optional **mark**. `mark()` remembers the current position and `reset()` restores the position to that mark. Operations such as `clear()`, `flip()`, and `rewind()` discard the mark, so it is not a bookmark that survives every state transition.

`rewind()` sets `position = 0` while **keeping the current `limit`**, which is useful when the same readable region should be consumed again from the beginning. That differs from `clear()`, which reopens the full `[0, capacity)` range for a new write phase.

`compact()` serves a different case: some data remains unread. Suppose a flipped buffer contains six valid bytes and the application consumed only two:

Like `clear()`, `flip()`, and `rewind()`, `compact()` also **discards the mark** if one is currently defined.

~~~text
position = 2
limit    = 6
capacity = 8

[A][B][C][D][E][F][?][?]
       ^           ^
       position    limit
~~~

Call:

~~~java
buffer.compact();
~~~

The unread bytes `[C][D][E][F]` are copied to the beginning. The resulting state is:

~~~text
[C][D][E][F][...free space...]
             ^
             position = 4

limit = capacity = 8
~~~

The buffer can now receive more data without losing the unread bytes. After filling it again, call `flip()` before returning to consumption.

A useful cycle is:

~~~text
fill buffer
→ flip()
→ consume buffer
→ clear() if everything was consumed
  or compact() if unread data remains
→ fill again
~~~

If `put` tries to move beyond `limit`, `BufferOverflowException` may occur. If `get` tries to read beyond `limit`, `BufferUnderflowException` may occur. These failures often reveal an incorrect understanding of the current buffer state.
