Once a `Socket` is connected, `getInputStream()` exposes bytes arriving at the local endpoint and `getOutputStream()` exposes bytes sent toward the remote endpoint.

```java
InputStream in = socket.getInputStream();
OutputStream out = socket.getOutputStream();

out.write("PING\n".getBytes(StandardCharsets.UTF_8));
out.flush();

byte[] buffer = new byte[1024];
int read = in.read(buffer);
if (read == -1) {
    // The peer ended its sending direction and all received bytes were consumed.
}
```

`read(byte[])` does not promise to fill the buffer. It can return fewer bytes than the buffer size even when the sender performed one large `write()`. Conversely, one read can contain bytes originating from several earlier writes. That behavior follows directly from the **byte-stream** model.

`write()` contributes bytes to the stream; it does not turn the call into one message on the wire. If the socket stream is wrapped in `BufferedOutputStream`, `BufferedWriter`, `DataOutputStream`, or another buffered layer, account for the wrapper's buffering rules. `flush()` matters when a wrapper is holding data that the peer needs before the protocol can progress.

When the peer normally finishes its sending direction and every received byte has been consumed, `InputStream.read()` returns `-1`. That value is stream EOF, not a data byte and not a signal that "no data is available right now."
