The simplest approach is manual mapping:

```java
UserDto dto = new UserDto();
dto.setId(entity.getId());
dto.setName(entity.getName());
```

Manual mapping is often the best choice when mappings are few, semantics are explicit, and complete control is desirable.

The problem grows when field count, nested objects, collections, and conversion rules increase, producing boilerplate and missed-field risk.
