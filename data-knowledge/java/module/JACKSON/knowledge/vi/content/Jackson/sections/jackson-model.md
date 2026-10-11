```text
Java object
    ↓ serialization
JSON tokens/tree/text
    ↓ deserialization
Java object
```

Jackson có nhiều layer API:

- data binding qua `ObjectMapper`;
- tree model;
- streaming parser/generator;
- annotation và module extension.
