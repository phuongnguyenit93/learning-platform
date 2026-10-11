Recurring Java networking failures usually come from a wrong mental model rather than difficult syntax:

1. **No time bound on an operation that can wait**  
   A request path can retain resources indefinitely when a peer stops responding.

2. **Treating one TCP read as one message**  
   TCP is a byte stream; message framing belongs to the application protocol.

3. **Treating UDP connect as a reliable connection**  
   DatagramSocket.connect associates/filters a peer; it does not add delivery guarantees.

4. **Tuning socket options by recipe**  
   Buffers, linger, keepalive, and TCP_NODELAY only make sense when the bottleneck and OS behavior are understood.

5. **Catching IOException and retrying everything**  
   Unknown host, refused connection, timeout, and invalid application data are different failures.

6. **Leaking sockets or leaving ownership ambiguous**  
   File-descriptor exhaustion eventually becomes a production outage.

7. **Assuming non-blocking is always superior**  
   Selector-based designs carry state-management cost; Java 21 virtual threads make blocking style practical for many I/O-bound workloads.

The next chapter introduces NIO so that its additional complexity can be chosen for a reason rather than by default.
