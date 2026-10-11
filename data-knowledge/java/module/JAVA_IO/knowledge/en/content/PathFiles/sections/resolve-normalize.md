Applications commonly have a base directory and need paths below it. `resolve` expresses that relationship directly:

~~~java
Path root = Path.of("workspace");
Path file = root.resolve("notes").resolve("today.txt");
~~~

If the argument passed to `resolve` is absolute, the result is that absolute path. This matters when a path fragment comes from configuration or input.

`normalize()` simplifies path syntax, removing `.` elements and reducible `name/..` pairs:

~~~java
Path raw = Path.of("data", ".", "reports", "..", "note.txt");
Path normalized = raw.normalize();

System.out.println(normalized); // data/note.txt
~~~

`normalize()` **does not access the filesystem** and does not resolve symbolic links. A symbolic link (often called a symlink) is a filesystem entry that points to another path/target instead of containing that target's data itself. That is why `normalize()` differs from `toRealPath()`: `toRealPath()` accesses the filesystem, requires the path to exist, and resolves it according to filesystem/link behavior.

With symbolic links, a path containing `..` can have runtime meaning that differs from its purely syntactic normalized form. Do not treat `normalize()` as proof that two paths necessarily identify the same file.

`relativize()` answers the reverse question: “how do I get from A to B using a relative path?”:

~~~java
Path base = Path.of("workspace", "docs");
Path target = Path.of("workspace", "images", "logo.png");

Path relative = base.relativize(target);
System.out.println(relative);
~~~

The paths must be compatible, for example both absolute or both relative and from a compatible filesystem. `relativize()` is useful for stored relative links or shorter display paths, but it is still a path operation; it does not read or write file content.
