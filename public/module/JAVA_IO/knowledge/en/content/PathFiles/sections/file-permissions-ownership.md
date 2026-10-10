`BasicFileAttributes` provides a relatively portable baseline, but filesystems expose additional groups of metadata. NIO.2 models these groups as **file attribute views**: a view describes which family of metadata a provider can read or write.

```text
BasicFileAttributeView
→ size, timestamps, file type, fileKey...

PosixFileAttributeView
→ owner, group, rwx permissions on POSIX-style filesystems

DosFileAttributeView
→ readonly, hidden, archive, system on providers with DOS attributes

FileOwnerAttributeView
→ owner represented as a UserPrincipal
```

Do not infer support only from the operating-system name. Ask the filesystem/provider that actually stores the file:

```java
FileStore store = Files.getFileStore(note);

boolean posixSupported =
        store.supportsFileAttributeView(PosixFileAttributeView.class);
boolean dosSupported =
        store.supportsFileAttributeView(DosFileAttributeView.class);
```

When POSIX attributes are supported, code can read a set of `PosixFilePermission` values:

```java
if (Files.getFileStore(note)
        .supportsFileAttributeView(PosixFileAttributeView.class)) {

    Set<PosixFilePermission> permissions =
            Files.getPosixFilePermissions(note);

    System.out.println(permissions);
}
```

POSIX permissions model `READ`, `WRITE`, and `EXECUTE` access for **owner / group / others**. When an application really needs to change them, `Files.setPosixFilePermissions(...)` writes a new permission set, but the operation can still fail because the provider does not support POSIX attributes or because the process lacks the required authority. Permissions are therefore a filesystem capability plus an operating-system authorization question, not merely a Java enum.

Ownership is represented by a `UserPrincipal`:

```java
UserPrincipal owner = Files.getOwner(note);
System.out.println(owner.getName());
```

`Files.setOwner(...)` or a `FileOwnerAttributeView` can change the owner when the provider supports that operation and the operating system permits it. Changing ownership is commonly privileged, so code must not assume that the current process is always allowed to do it.

Symbolic links remain an important boundary. Attribute APIs commonly follow the target by default. When code needs metadata for **the link entry itself**, use an API/view that accepts `LinkOption.NOFOLLOW_LINKS`, for example:

```java
PosixFileAttributeView linkView = Files.getFileAttributeView(
        linkPath,
        PosixFileAttributeView.class,
        LinkOption.NOFOLLOW_LINKS);
```

The view may be `null` when the provider does not support that attribute family. Portable code should provide a fallback or state its required capability clearly instead of assuming every filesystem has identical POSIX, DOS, ACL, or ownership semantics.
