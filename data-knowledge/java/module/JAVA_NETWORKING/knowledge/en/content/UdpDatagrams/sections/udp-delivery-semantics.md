UDP preserves the **datagram boundary** at the API: one send corresponds to one datagram, and one receive obtains one datagram (or its leading portion if the buffer is too small). That boundary does not imply reliable delivery.

`DatagramSocket` does not add TCP-like guarantees for the application:

- a datagram may fail to arrive;
- datagrams can arrive in a different order from the send order;
- an application should not depend on each logical message appearing exactly once if its protocol requires stronger semantics;
- the sender does not receive a stream-level acknowledgment from `DatagramSocket` proving that the peer application processed the message.

If a use case needs sequence numbers, acknowledgments, retries, duplicate detection, expiration, or application-level reassembly, the application protocol must define those rules. The JDK UDP API does not turn UDP into a reliable session automatically.

For example, an independent telemetry sample may tolerate occasional loss and favor simple low-overhead delivery. A workflow where every command must be processed in strict order needs additional protocol semantics or a transport with more suitable guarantees.

Keep this contrast with TCP clear:

```text
TCP -> ordered byte stream; the application defines message framing
UDP -> datagram boundaries are present; the application adds reliability/order if required
```
