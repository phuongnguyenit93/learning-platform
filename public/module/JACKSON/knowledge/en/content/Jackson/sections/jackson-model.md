```text
Java object
    ↓ serialization
JSON tokens/tree/text
    ↓ deserialization
Java object
```

Jackson exposes several API layers:

- data binding through `ObjectMapper`;
- tree model;
- streaming parser/generator;
- annotations and module extensions.
