# Resource Lifetime and Failure Safety

An ordinary `byte[]` or `String` lives in memory managed by the JVM. Streams, channels, directory streams, and file locks are different: they often represent an **external resource** such as a file descriptor (an operating-system identifier for an open I/O resource such as a file, socket, or pipe) or another native handle supplied by the platform.

That means I/O lifetime cannot rely on “when references disappear, GC will take care of it.” GC manages Java memory; application code still needs deterministic release of I/O resources.

~~~text
open/acquire
→ use
→ close/release

this must work after:
→ success
→ early return
→ exception
~~~
