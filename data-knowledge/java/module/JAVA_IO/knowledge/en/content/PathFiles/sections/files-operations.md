Once a `Path` exists, the `Files` utility class provides common filesystem operations. For small files with known bounds, modern Java provides convenient whole-content read/write methods:

~~~java
Path tempDir = Files.createTempDirectory("io-demo-");
Path note = tempDir.resolve("note.txt");

Files.writeString(
        note,
        "Hello Java I/O",
        StandardCharsets.UTF_8
);

String loaded = Files.readString(note, StandardCharsets.UTF_8);
System.out.println(loaded);
~~~

The explicit `StandardCharsets.UTF_8` makes the byte-to-character conversion rule visible.

Common operation groups include:

| Need | Typical API |
| --- | --- |
| Create directories | `Files.createDirectory`, `Files.createDirectories` |
| Create a file | `Files.createFile` |
| Read/write a small file | `readString`, `writeString`, `readAllBytes`, `write` |
| Open a stream/reader/writer | `newInputStream`, `newOutputStream`, `newBufferedReader`, `newBufferedWriter` |
| Copy | `copy` |
| Move/rename | `move` |
| Delete | `delete`, `deleteIfExists` |

`createDirectory` creates one directory and requires its parent to exist. `createDirectories` creates missing parents as needed:

~~~java
Path reports = tempDir.resolve("a").resolve("b").resolve("reports");
Files.createDirectories(reports);
~~~

Copy and move behavior should be explicit when options matter:

~~~java
Path copy = tempDir.resolve("note-copy.txt");
Files.copy(note, copy, StandardCopyOption.REPLACE_EXISTING);

Path moved = tempDir.resolve("archive.txt");
Files.move(copy, moved, StandardCopyOption.REPLACE_EXISTING);
~~~

`StandardCopyOption.ATOMIC_MOVE` can request an atomic move: observers should not see an intermediate state where only part of the move has happened. Not every filesystem supports this capability. If atomicity is a real requirement, handle `AtomicMoveNotSupportedException` instead of assuming the option always succeeds.

Several operation semantics are easy to misread:

- `Files.copy(source, target)` follows a source symbolic link by default and copies the link target. With `LinkOption.NOFOLLOW_LINKS`, the link itself is copied instead.
- `Files.move(...)` moves the symbolic link itself when the source is a symlink; it does not move the target the link points to.
- `Files.copy(...)` on a directory creates the corresponding target directory; it does **not** recursively copy the directory tree. Recursive copy requires tree traversal such as `walkFileTree`.
- `Files.delete(...)` is not a recursive tree delete; deleting a non-empty directory can fail with `DirectoryNotEmptyException`.
- With `ATOMIC_MOVE`, the other move options are ignored. If the target already exists, replace-versus-fail behavior is implementation-specific, so portable code must not assume `REPLACE_EXISTING` is guaranteed in an atomic move.

`Files` also has overloads that accept `StandardOpenOption`:

~~~java
Files.writeString(
        note,
        System.lineSeparator() + "next line",
        StandardCharsets.UTF_8,
        StandardOpenOption.CREATE,
        StandardOpenOption.APPEND
);
~~~

A compact mental model for common options:

| Option | Meaning |
| --- | --- |
| `READ` | Open for reading |
| `WRITE` | Open for writing |
| `CREATE` | Create the file if it does not exist |
| `CREATE_NEW` | Create only if absent; fail if it already exists |
| `APPEND` | Write at the end of the file |
| `TRUNCATE_EXISTING` | When opened for writing, truncate an existing file to length 0 |

These options describe the **file-open contract**, not just syntax. `CREATE_NEW`, for example, expresses “create-or-fail,” while `APPEND` expresses “add to the end rather than overwrite from the beginning.”

For large content, `readAllBytes` and `readString` are poor defaults because they load the whole file into memory. Streams, readers/writers, or channels let the program process data incrementally. The final chapter will bring these choices together.
