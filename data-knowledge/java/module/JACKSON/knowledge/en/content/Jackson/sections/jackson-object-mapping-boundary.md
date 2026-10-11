MapStruct and ModelMapper primarily transform:

```text
Object A → Object B
```

Jackson primarily transforms:

```text
Object ↔ external data representation
```

Jackson can bind JSON into a DTO, but its canonical concern here remains serialization/data binding rather than DTO-to-DTO mapping.
