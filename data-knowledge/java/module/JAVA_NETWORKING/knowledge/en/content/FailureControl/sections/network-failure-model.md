Network failures are easier to reason about when classified by lifecycle stage instead of being reduced to one generic IOException.

~~~text
resolve
→ UnknownHostException

bind
→ BindException / address in use / permission failure

connect
→ ConnectException / timeout / route failure

read-write
→ SocketTimeoutException / EOF / reset / IOException

closed resource
→ SocketException / ClosedChannelException
~~~

**EOF is not a timeout.** On a TCP stream, read returning -1 normally means the peer's output has reached end-of-stream from the local side's perspective. A timeout means data did not arrive within the configured wait. A reset is a different termination mode again.

Context matters. A ConnectException to a known host and port tells a different story from an UnknownHostException before an IP address exists.

Useful logging retains the stage, operation, and local/remote endpoints without dumping secret payloads. Good classification also helps decide what may be retried, what is a configuration error, and what belongs to a higher-level resilience policy.
