When code uses a host name, the system has to resolve that name to one or more IP addresses. InetAddress.getByName(...) can trigger name resolution and may fail with UnknownHostException.

Resolution is fallible system I/O, not a pure string transformation:

~~~text
host name
   ↓
resolver used by the JVM/platform
   ↓
one or more IP addresses
~~~

The JDK caches successful and failed lookups according to relevant networking/security configuration. A DNS change outside the process therefore does not imply that an already-running JVM immediately observes a new result.

A practical distinction is that the core InetAddress lookup methods do not accept a per-call timeout. Do not assume a socket connect timeout also bounds DNS resolution; they are different stages.

Classify failures by stage:

- resolution failure → commonly UnknownHostException;
- resolution succeeds but transport connection fails → ConnectException, timeout, or another socket error;
- multiple resolved addresses → the effective endpoint depends on which address is attempted.

When troubleshooting, recording both the original host name and the resolved address helps separate resolution failures from connection failures.

Resolution can also happen in the reverse direction. If an `InetAddress` was created only from an IP address, `getHostName()` may perform a reverse name lookup; `getCanonicalHostName()` is explicitly a best-effort fully qualified name lookup. This matters in logging and diagnostic paths because a method that appears to be simple formatting can cross the resolver boundary. When code only needs to preserve the host text of an `InetSocketAddress`, `getHostString()` avoids triggering a reverse lookup.
