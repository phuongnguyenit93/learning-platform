Ba đầu vào cốt lõi:

- `Lookup`: access context của class chứa dynamic call site;
- `name`: symbolic name do classfile/phía gọi cung cấp;
- `MethodType`: descriptor của dynamic call site.

Static bootstrap arguments bổ sung configuration đã encode trong classfile. Chúng là các **loadable constant-pool values** như primitive/String constant, `Class`, `MethodHandle` hoặc `MethodType`; một số giá trị cũng có thể cần được resolve động trước khi bootstrap nhận được chúng.

Mental model:

```text
class chứa call site
   ↓ Lookup

symbolic operation
   ↓ name

hợp đồng lời gọi
   ↓ MethodType

loadable constant-pool values
   ↓ static args

bootstrap policy
   ↓
CallSite
```

`Lookup` ở đây quan trọng vì bootstrap thường cần resolve member theo quyền của class chứa call site, không phải quyền tùy ý của phần triển khai bootstrap.
