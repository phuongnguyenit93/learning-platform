A `Path` does not exist by itself. **Every `Path` belongs to a particular `FileSystem`.** A `FileSystem` describes the namespace and path rules in which that path lives: available roots, separator rules, backing stores, and the capabilities exposed by the provider underneath it.

Keep this mental model:

~~~text
Path
→ belongs to a FileSystem
→ the FileSystem is implemented/provided by a FileSystemProvider
→ data is backed by one or more FileStore objects
~~~

In most ordinary desktop/server programs, `Path.of(...)` uses the operating system's **default filesystem**. NIO.2 is broader than that, however: Java can work with alternate provider-backed filesystems, for example ZIP/JAR filesystems. That is one reason `Path` is a richer abstraction than “a Windows/Linux path string.”

~~~java
Path path = Path.of("data", "note.txt");
FileSystem fs = path.getFileSystem();

System.out.println(fs.provider().getScheme());
System.out.println(fs.getSeparator());
~~~

`FileSystemProvider` is the implementation layer behind filesystem operations. Application code normally **does not call a provider directly**; it uses `Path` and `Files`, and the provider performs the operation according to that filesystem's capabilities. This gives one common explanation for several portability boundaries in this chapter:

~~~text
ATOMIC_MOVE may be unsupported
POSIX permission views may not exist
WatchService delivery can differ
symbolic-link behavior can differ
→ because capability/semantics depend on the filesystem + provider
~~~

`FileStore` represents the backing storage/filesystem volume containing a path. It can expose information such as capacity and supported attribute views:

~~~java
FileStore store = Files.getFileStore(path);

long total = store.getTotalSpace();
long usable = store.getUsableSpace();

boolean posix =
        store.supportsFileAttributeView("posix");
~~~

Capacity values are snapshots at query time, not quota or transaction guarantees. Likewise, a `FileStore` reporting support for an attribute view means that capability exists at the store/provider level; a specific operation can still fail because of permissions, file state, or races.

One important consequence is that **not every `Path` from every provider can be converted to `java.io.File`**. `Path.toFile()` is supported only by the default provider; another provider can throw `UnsupportedOperationException`. Modern code should therefore keep values as `Path` instead of converting to `File` merely by habit.

Paths from incompatible providers/filesystems also should not be mixed casually. Operations such as `resolve`, `relativize`, copy, and move have filesystem/provider boundaries of their own. Reusable code should treat **filesystem identity** as part of the context instead of assuming every path is the same kind of path.

Beginners do not need to implement a custom `FileSystemProvider` here. The goal is architectural understanding: a `Path` has an owning `FileSystem`, `Files` dispatches operations through the provider, and `FileStore` describes backing storage/capabilities. That mental model ties together the portability caveats throughout this chapter.
