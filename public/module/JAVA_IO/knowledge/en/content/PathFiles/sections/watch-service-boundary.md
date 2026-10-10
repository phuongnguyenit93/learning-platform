Sometimes an application needs more than a snapshot of a directory: it needs to know whether entries are **created, modified, or deleted after registration**. `WatchService` is the NIO.2 abstraction for receiving this kind of filesystem change notification.

Mental model:

```text
directory
   ↓ register
WatchService
   ↓ filesystem/provider reports a change
WatchKey becomes signalled
   ↓ pollEvents()
WatchEvent: create / modify / delete / overflow
   ↓ processing complete
reset WatchKey
```

Create a watcher and register one directory:

```java
try (WatchService watcher = tempDir.getFileSystem().newWatchService()) {
    tempDir.register(
            watcher,
            StandardWatchEventKinds.ENTRY_CREATE,
            StandardWatchEventKinds.ENTRY_MODIFY,
            StandardWatchEventKinds.ENTRY_DELETE);

    WatchKey key = watcher.take(); // block until a key is signalled

    for (WatchEvent<?> event : key.pollEvents()) {
        if (event.kind() == StandardWatchEventKinds.OVERFLOW) {
            System.out.println("One or more events may have been lost");
            continue;
        }

        Path relative = (Path) event.context();
        Path changed = tempDir.resolve(relative);
        System.out.println(event.kind().name() + ": " + changed);
    }

    boolean stillValid = key.reset();
    if (!stillValid) {
        System.out.println("Directory registration is no longer valid");
    }
}
```

`take()` **blocks** until a `WatchKey` is available. `poll()` returns immediately and yields `null` when no key is ready; the `poll(timeout, unit)` overload provides a bounded wait. These methods express different coordination policies rather than different event accuracy.

A `WatchKey` represents a registration that has been signalled. After consuming its events with `pollEvents()`, code must call `reset()` so the key can return to the waiting state and be signalled again. If `reset()` returns `false`, the registration is no longer valid, for example because the directory was deleted or the key was cancelled.

For directory events, `WatchEvent.context()` is normally a path **relative to the registered directory**, so code resolves it against that directory when it needs a full path. A watcher is also **not recursive by default**: registering `root` does not automatically watch all current or future subdirectories; recursive designs must manage registrations for the relevant directories themselves.

`OVERFLOW` is a crucial signal: the provider reports that events may have been lost or discarded. When correctness requires the final filesystem state to be exact, the application should **rescan the filesystem** instead of treating the received event list as a complete history.

`WatchService` is an abstraction over the filesystem/provider, so observation details are **not completely portable**. Events may be coalesced, the number of `ENTRY_MODIFY` notifications can vary, a rename may appear as delete + create, latency can differ, and remote/network filesystems may behave differently. Treat a watcher as a notification that filesystem state changed and should be examined, not as an absolute transaction log.

`WatchService` is a resource and must be closed. Closing it releases registrations/provider resources; a thread waiting on the watcher can receive `ClosedWatchServiceException`. Its ownership should therefore be explicit just like other I/O resources.

At this point `Path` gives us an address and `Files` gives us operations. The next chapter changes the model: NIO separates **the data staging area** (`Buffer`) from **the conduit that moves data** (`Channel`).
