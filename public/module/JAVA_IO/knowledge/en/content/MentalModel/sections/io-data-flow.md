A program needs one model for **reading data from a source** and **writing data to a sink**. A source or sink can be a file, console, socket, device, or even an in-memory region inside the current process. I/O exists to model those data exchanges without forcing application code to invent an unrelated mechanism for every endpoint type.

When an endpoint is a resource outside ordinary Java-managed memory, such as a file or socket, the program also crosses a **resource boundary** with its own lifetime. Objects, local variables, and arrays in RAM do not automatically become persistent when the process ends; data that must outlive those objects has to be written to an appropriate storage destination.

**I/O (Input/Output)** is the set of mechanisms used to move data **into** a program and **out of** a program.

A useful starting model is:

```text
source ── input ──> program ── output ──> sink
```

- A **source** is where data comes from, such as a file, **socket** (a network endpoint used by a program to exchange data), keyboard, or memory region.
- A **sink** is where data goes, such as a file, socket, screen, or memory region.
- The **payload** is the data being moved.
- A **resource boundary** is where Java code starts interacting with a resource that has its own lifetime, often managed by the operating system or another component outside the process. Not every I/O abstraction crosses such a boundary; an in-memory byte-array stream is one example.

Suppose an application writes `Xin chào Java ☕` to a file and reads it back:

```text
String in RAM
    ↓ encode to bytes
temporary file on the filesystem
    ↓ read bytes + decode
new String in RAM
```

If the original string only stays in RAM, it disappears with the process. Writing it to a file creates a representation that can outlive the object currently stored on the **heap**, the JVM memory area where Java objects normally live.

A **filesystem** is the operating-system mechanism that organizes files, directories, and information about them. That accompanying information is **metadata**, such as whether an entry exists, its type, size, or modification time; metadata is different from the file's content bytes.

**Buffering** is different from **storage or the underlying resource**. A buffer is temporary memory used to batch data and reduce many small I/O operations; it does not by itself make data persistent. A file, socket, or device is the source or sink that the buffer helps application code communicate with.

The major terms in this module form a learning path rather than an unrelated list:

```text
I/O data flow
    ↓ data needs a transfer unit
byte streams
    ↓ text needs a character conversion layer
character streams
    ↓ many tiny operations can be expensive
wrappers and buffering
    ↓ files also have names, paths, and metadata
File → Path / Files
    ↓ NIO separates stored data from the conduit that moves it
Buffer / Channel / FileChannel
    ↓ external resources need explicit lifetime ownership
resource management
    ↓ some data can be represented as an object graph
serialization
    ↓ finally choose the simplest correct abstraction
choosing I/O
```

The major components and their roles are:

| Component | Role |
| --- | --- |
| Byte streams | Read/write raw byte data; structured primitive fields additionally need an explicit type/order contract. |
| Character streams + `Charset` | Work with text and convert correctly between characters and bytes. |
| Buffering | Batch small operations into larger chunks to reduce I/O overhead. |
| `File` vs `Path` / `Files` | Represent and operate on filesystem locations/metadata; `File` is the older API and `Path`/`Files` are the newer model. |
| `WatchService` | Receive filesystem change notifications such as create/modify/delete with provider/platform boundaries. |
| `Buffer` / `Channel` / `FileChannel` | NIO's data-container and transfer model; `ByteOrder` controls multi-byte primitive interpretation and channels can support multi-buffer transfer. |
| `AsynchronousFileChannel` | Positional file I/O whose completion is asynchronous instead of keeping the calling thread blocked until completion. |
| Resource management | Decide who owns a resource and when it must be closed. |
| Serialization | Convert object state using a specific serialization format. |
| Choosing I/O | Select the simplest correct abstraction for the payload, scale, and operation pattern. |

**NIO (New I/O)** is Java's newer family of I/O APIs, including concepts such as `Buffer`, `Channel`, and `java.nio.file`. For now, treat it as another I/O abstraction family that later chapters introduce; not every NIO API is non-blocking.

The key boundary is broader than file access. A file is only one kind of source or sink. The same source → payload → sink model also applies to networks, consoles, memory streams, and other devices.
