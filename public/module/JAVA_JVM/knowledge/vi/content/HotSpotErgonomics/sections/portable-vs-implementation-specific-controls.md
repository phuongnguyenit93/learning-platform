Portable behavior là semantics được Java/JVM specification đảm bảo. Implementation-specific control là cách một VM cụ thể expose tuning và hành vi nội bộ.

Ví dụ:

```text
Object allocation semantics
→ JVM contract

-XX:+UseG1GC
→ HotSpot control

frame semantics
→ JVM contract

code-cache sizing flag
→ HotSpot implementation control
```

Code ứng dụng không nên cần implementation-specific flag để đúng về correctness. Flag chỉ nên điều chỉnh performance/hành vi vận hành.

Nếu correctness phụ thuộc một hành vi VM không được tài liệu hóa, design đó rất dễ vỡ khi đổi JDK/vendor.
