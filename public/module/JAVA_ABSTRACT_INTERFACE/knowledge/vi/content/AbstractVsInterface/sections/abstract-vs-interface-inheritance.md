Java chỉ cho một lớp `extends` một lớp:

```text
kế thừa lớp
→ chỉ một lớp cha trực tiếp
```

nhưng một lớp có thể `implements` nhiều interface:

```text
triển khai interface
→ có thể kết hợp nhiều vai trò/khả năng độc lập
```

Điều này giúp interface phù hợp cho các vai trò xuất hiện ở nhiều hệ phân cấp khác nhau, ví dụ `Comparable`, `AutoCloseable`, `Serializable` hoặc một khả năng trong miền nghiệp vụ như `Refundable`.
