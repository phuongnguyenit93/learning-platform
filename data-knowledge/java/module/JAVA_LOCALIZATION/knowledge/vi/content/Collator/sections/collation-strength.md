Không phải mọi khác biệt ký tự đều cần được xem là quan trọng như nhau. `Collator` có các mức `strength` để quyết định mức phân biệt.

Các mức quen thuộc:

```text
PRIMARY
→ khác biệt cơ bản của chữ cái

SECONDARY
→ thường xét thêm dấu/diacritic

TERTIARY
→ thường xét thêm chữ hoa/chữ thường và khác biệt chi tiết hơn

IDENTICAL
→ mức phân biệt chặt nhất
```

Cách chính xác từng ngôn ngữ diễn giải các mức này phụ thuộc quy tắc collation. Không nên suy ra một bảng chung cho mọi Locale.

```java
Collator collator = Collator.getInstance(Locale.US);
collator.setStrength(Collator.PRIMARY);
```

Khi `strength` thấp hơn, hai String khác nhau về code point vẫn có thể `compare(...) == 0` theo quy tắc collation.

Chế độ phân rã quyết định cách `Collator` xử lý các biểu diễn Unicode trước/trong khi so sánh. Hai chuỗi nhìn giống nhau có thể được biểu diễn bằng code point đã ghép hoặc bằng ký tự cơ sở + combining mark.

```java
collator.setDecomposition(Collator.NO_DECOMPOSITION);
collator.setDecomposition(Collator.CANONICAL_DECOMPOSITION);
collator.setDecomposition(Collator.FULL_DECOMPOSITION);
```

`NO_DECOMPOSITION`, `CANONICAL_DECOMPOSITION` và `FULL_DECOMPOSITION` biểu diễn các mức xử lý khác nhau. Không nên học chúng như “mức mạnh hơn/yếu hơn” của `strength`: **strength** quyết định khác biệt nào có ý nghĩa khi so sánh, còn **decomposition** quyết định cách chuẩn bị biểu diễn Unicode cho phép so sánh.
