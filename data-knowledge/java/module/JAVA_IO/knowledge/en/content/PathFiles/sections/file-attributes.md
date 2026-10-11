File content is the data inside the file. **Metadata** describes the file: size, timestamps, file type, permissions, and other filesystem-provided properties.

Simple queries include:

~~~java
System.out.println(Files.exists(note));
System.out.println(Files.isRegularFile(note));
System.out.println(Files.isDirectory(note));
System.out.println(Files.size(note));
System.out.println(Files.getLastModifiedTime(note));
~~~

`Files.exists(path)` and `Files.notExists(path)` are **not exact logical complements**. If the filesystem cannot determine the state, both can return `false`:

~~~text
exists == true
→ existence was confirmed at the time of the check

notExists == true
→ non-existence was confirmed at the time of the check

both false
→ the state could not be determined
~~~

If the real question is whether two `Path` values identify the same file, do not infer that only from path strings or `normalize()`. `Files.isSameFile(a, b)` handles filesystem identity and cases such as symbolic links more directly. One important caveat is that when the two `Path` values are already equal, `isSameFile` returns `true` without checking whether the file exists, so **it is not an existence check**.

When several attributes are needed together, `readAttributes` expresses that intent directly:

~~~java
BasicFileAttributes attrs =
        Files.readAttributes(note, BasicFileAttributes.class);

System.out.println(attrs.size());
System.out.println(attrs.creationTime());
System.out.println(attrs.lastModifiedTime());
System.out.println(attrs.isRegularFile());
~~~

`BasicFileAttributes` is a relatively portable baseline. Some filesystems support specialized views such as `PosixFileAttributes` or DOS attributes. Code using those views must accept that another filesystem may not support them.

Symbolic links also affect metadata. Many operations follow a link to its target by default. When code needs information about the link entry itself, applicable APIs accept `LinkOption.NOFOLLOW_LINKS`:

~~~java
boolean followsTarget = Files.exists(note);
boolean pathEntryExists =
        Files.exists(note, LinkOption.NOFOLLOW_LINKS);
~~~

A common design mistake is:

~~~text
check exists
→ assume the state remains unchanged
→ perform the real operation later
~~~

The filesystem can change between the check and the operation because of another thread or process. Let the real operation determine success or failure and handle its exception instead of treating an earlier check as a guarantee.
