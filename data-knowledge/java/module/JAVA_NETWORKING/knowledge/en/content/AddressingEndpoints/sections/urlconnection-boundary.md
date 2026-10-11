URLConnection is the older general abstraction for accessing a resource through a URL protocol handler. HttpURLConnection extends that model with HTTP-specific behavior.

Example:

~~~java
URLConnection connection =
        URI.create("https://example.com")
           .toURL()
           .openConnection();

connection.setConnectTimeout(3_000);
connection.setReadTimeout(3_000);
~~~

These are **URLConnection operation** timeouts, not a universal DNS timeout. One HttpURLConnection instance represents one request, while the underlying transport connection may be reused transparently by the implementation.

For new HTTP client code, java.net.http.HttpClient usually provides a clearer model because it separates reusable client configuration, requests, response-body handling, synchronous/asynchronous completion, and WebSocket creation.

This section exists because URLConnection is still part of the JDK networking model and appears in legacy code and library APIs. Modern HTTP mechanics are covered in the dedicated HttpClient chapter.
