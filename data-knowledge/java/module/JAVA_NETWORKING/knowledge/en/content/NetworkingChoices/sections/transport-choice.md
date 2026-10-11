Start with data semantics rather than API familiarity.

**TCP / Socket**

- ordered byte stream;
- connection-oriented communication;
- application-owned framing/protocol;
- direct connection lifecycle control.

**UDP / Datagram**

- independent datagram boundaries;
- transport can lose, reorder, or duplicate traffic;
- useful where connection-oriented stream semantics are not a fit;
- reliability above UDP, if required, belongs to the application protocol.

**HttpClient**

- the problem is naturally HTTP request/response;
- reusable client configuration, redirects, proxies, authentication, body handling, HTTP/1.1 or HTTP/2 are useful;
- the application should not implement HTTP framing itself.

**WebSocket client**

- a long-lived bidirectional message-oriented connection is required;
- the server speaks WebSocket;
- the application accepts an event/listener lifecycle.

Quick map:

~~~text
custom stream protocol      → TCP
independent datagrams       → UDP
HTTP resource interaction   → HttpClient
bidirectional WS messaging  → WebSocket client
~~~

Requirements such as “real-time” or “fast” are not sufficient by themselves. Delivery semantics, lifetime, and application protocol still have to be identified.
