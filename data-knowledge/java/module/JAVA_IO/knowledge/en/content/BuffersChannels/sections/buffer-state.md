For a `ByteBuffer`, imagine a fixed-size array of byte slots:

~~~java
ByteBuffer buffer = ByteBuffer.allocate(8);
~~~

Immediately after allocation:

~~~text
capacity = 8
limit    = 8
position = 0
~~~

The three values mean:

| Value | Meaning |
| --- | --- |
| `capacity` | Total number of elements the buffer can hold; fixed for that buffer |
| `position` | Index where the next relative read or write begins |
| `limit` | One-past-the-end boundary for the currently usable region |

They always satisfy:

~~~text
0 <= position <= limit <= capacity
~~~

While **putting data into the buffer**, `position` advances:

~~~java
ByteBuffer buffer = ByteBuffer.allocate(8);

buffer.put((byte) 10);
buffer.put((byte) 20);
buffer.put((byte) 30);
~~~

The state is now:

~~~text
capacity = 8
limit    = 8
position = 3

[10][20][30][?][?][?][?][?]
             ^
             position
~~~

`position = 3` does not mean that valid data starts at index 3. It means **index 3 is where the next relative operation begins**.

Relative `get()` operations also read at `position` and then advance it. The same buffer therefore commonly has two phases:

~~~text
fill the buffer
→ position moves forward

consume the buffer
→ position also moves forward
~~~

Moving between those phases requires updating the buffer boundaries correctly.
