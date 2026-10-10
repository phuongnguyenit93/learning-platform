# Resource Safety with try-with-resources

Files, streams, sockets, JDBC objects, and other resources outside ordinary heap memory need to be **released at a defined time**. The Garbage Collector manages Java object memory; it is not the contract for timely release of file descriptors, sockets, or database handles.

Try-with-resources (TWR) makes resource ownership and cleanup explicit in the language.
