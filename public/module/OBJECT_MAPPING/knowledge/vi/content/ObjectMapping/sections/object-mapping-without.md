Cách đơn giản nhất là mapping thủ công:

```java
UserDto dto = new UserDto();
dto.setId(entity.getId());
dto.setName(entity.getName());
```

Manual mapping thường là lựa chọn tốt khi mapping ít, semantic rõ và cần kiểm soát tuyệt đối.

Vấn đề xuất hiện khi số field, nested object, collection và conversion rule tăng lên, khiến boilerplate và nguy cơ bỏ sót field tăng theo.
