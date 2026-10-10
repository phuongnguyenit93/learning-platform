URI and URL live near the networking APIs, but their main job is **resource identification**, not socket addressing.

A URI can have the shape:

~~~text
scheme://authority/path?query#fragment
~~~

For example:

~~~java
URI uri =
        URI.create("https://api.example.com/orders/42?detail=true");
~~~

The authority may eventually lead to a network endpoint, while the path and query express resource identity and protocol/application meaning above the socket layer.

URL is tied to protocol-handler based resource access and can open a URLConnection. URI is better suited to representing, validating, and manipulating identifiers. Modern APIs such as HttpRequest accept URI as the request target.

Practical rule:

- represent an identifier → prefer URI;
- represent a socket endpoint → SocketAddress / InetSocketAddress;
- perform modern HTTP client work → HttpClient + HttpRequest using a URI.

Avoid hand-parsing URLs with string slicing; the standard abstractions handle encoding, authorities, IPv6 literals, and relative-reference rules more safely.
