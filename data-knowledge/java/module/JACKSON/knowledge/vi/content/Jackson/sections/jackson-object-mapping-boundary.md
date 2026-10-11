MapStruct/ModelMapper chủ yếu chuyển:

```text
Object A → Object B
```

Jackson chủ yếu chuyển:

```text
Object ↔ external data representation
```

Jackson có thể bind JSON vào DTO nhưng canonical concern ở đây vẫn là serialization/data binding chứ không phải DTO-to-DTO mapping.
