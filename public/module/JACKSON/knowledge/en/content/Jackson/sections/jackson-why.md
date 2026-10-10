Applications regularly exchange data across boundaries such as HTTP APIs, messages, files, and external systems.

Those boundaries cannot directly transmit an in-memory Java object graph. Objects must be represented in a transferable or storable format and reconstructed on the receiving side.

Jackson automates much of the binding between Java types and JSON structures.
