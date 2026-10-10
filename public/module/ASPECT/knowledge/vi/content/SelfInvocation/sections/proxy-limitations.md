Proxy-based interception còn phụ thuộc khả năng method được proxy strategy hiện tại intercept.

Những case như private method, final method hoặc call nội bộ cần được đánh giá theo proxy mechanism cụ thể. Không nên suy luận đơn giản rằng "thêm annotation là đủ".

Các Spring feature như `@Transactional`, `@Async` hoặc `@Cacheable` cũng thường gặp cùng loại mental model vì chúng có thể dựa trên proxy/interceptor.

### Khi cần tránh self-invocation

Ưu tiên tốt nhất thường là refactor boundary sang một bean khác:

```text
Bean A
→ gọi Bean B proxy
→ advice có cơ hội chạy
```

Spring cũng có các kỹ thuật như self-injection hoặc `AopContext.currentProxy()`, nhưng chúng làm code phụ thuộc rõ hơn vào AOP infrastructure; `AopContext.currentProxy()` còn cần expose proxy. Với learning module này, chúng được xem là escape hatch chứ không phải design mặc định.
