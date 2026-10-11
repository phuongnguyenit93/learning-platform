Ba cách triển khai chính:

| Type | Target | Visibility model |
| --- | --- | --- |
| `ConstantCallSite` | Không đổi | Target permanent |
| `MutableCallSite` | Có thể đổi | Update giống ordinary field; thread khác có thể chưa thấy ngay |
| `VolatileCallSite` | Có thể đổi | Update/read có semantics tương tự volatile |

`ConstantCallSite` phù hợp khi bootstrap chỉ cần resolve target một lần:

```java
return new ConstantCallSite(target);
```

`MutableCallSite` phù hợp với runtime optimization nơi target có thể được cập nhật và visibility được quản lý có chủ đích.

`VolatileCallSite` đơn giản hơn khi cần mọi thread quan sát target update theo volatile semantics, nhưng mức đồng bộ chặt hơn có thể làm chi phí thực thi cao hơn.

Không chọn subclass chỉ vì tên nghe phù hợp; hãy bắt đầu từ câu hỏi: **target có cần đổi không, và thread khác cần thấy update với đảm bảo nào?**
