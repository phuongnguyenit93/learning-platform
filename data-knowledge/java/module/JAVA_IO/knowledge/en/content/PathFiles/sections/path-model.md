A `Path` models a path in a filesystem. An **absolute path** starts from a root/location that identifies the target independently of the current working directory, such as `C:\work\note.txt` or `/tmp/note.txt`. A **relative path** such as `data/note.txt` must be interpreted against a base path, often the working directory or another `Path` that code explicitly resolves it against.

The first important rule for a beginner is that **creating a Path does not access the filesystem**:

~~~java
Path path = Path.of("data", "note.txt");
~~~

The file may or may not exist. Filesystem work begins when code calls operations such as `Files.readString(path)`, `Files.exists(path)`, or `Files.createFile(path)`.

A `Path` is also more than a `String`. It understands path components:

~~~java
Path path = Path.of("data", "reports", "2026", "summary.txt");

System.out.println(path.getFileName()); // summary.txt
System.out.println(path.getParent());   // data/reports/2026 in filesystem-specific form
System.out.println(path.isAbsolute());  // false
~~~

Separators and display form depend on the filesystem. Build paths with `Path.of(...)`, `resolve(...)`, and other `Path` operations instead of manually joining strings with a separator character.

Keep the role split clear:

~~~text
Path
→ describes a path/location

Files
→ performs filesystem operations using a Path
~~~

The previous chapter introduced legacy `File`. `Path` and `Files` are generally preferred in modern Java because their responsibilities are clearer, they expose richer operations, and failures are represented by more specific exceptions.
