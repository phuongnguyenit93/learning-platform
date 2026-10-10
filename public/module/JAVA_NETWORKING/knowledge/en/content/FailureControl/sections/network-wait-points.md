Network code often appears “stuck” because it is **waiting for an external condition**, not because the JVM has stopped. Important waiting points include:

- host-name resolution;
- connecting to a remote endpoint;
- ServerSocket.accept() waiting for a new connection;
- InputStream.read() or DatagramSocket.receive() waiting for data;
- selector or asynchronous operations waiting through different readiness/completion models.

There is no single “network timeout” that covers the entire chain:

~~~text
resolve
  ↓
connect
  ↓
request / write
  ↓
read / receive
  ↓
close
~~~

Each stage has its own API and failure modes. Socket.connect(address, timeout) bounds connect, while Socket.setSoTimeout(...) bounds blocking reads; ServerSocket.setSoTimeout(...) bounds accept.

Before configuring a timeout, identify **which stage is supposed to be bounded**. Applying one number at the wrong boundary neither fixes the real hang nor produces useful diagnostics.
