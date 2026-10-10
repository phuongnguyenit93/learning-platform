Spring singleton chỉ nói rằng container thường dùng chung một bean instance.

Điều đó không tự động làm bean thread-safe hay thread-unsafe.

Một stateless service kiểu:

```java
@Service
class PriceService {
    BigDecimal calculate(Order order) {
        // chỉ dùng local variables và dependency thread-safe phù hợp
    }
}
```

tránh được một nhóm lớn race condition vì không giữ mutable request-specific state trong field.

Nhưng không nên nói "stateless bean an toàn tuyệt đối". Service vẫn có thể thao tác shared database row, mutable argument, external resource hoặc dependency không thread-safe.

### Bean scope không phải Thread scope

Spring còn có các scope như singleton, request và session, nhưng scope mô tả **lifecycle/lookup boundary của bean**, không phải một concurrency guarantee.

Mental model:

```text
singleton
→ một bean instance được dùng rộng trong application context

request scope
→ bean instance gắn với lifecycle của một HTTP request

session scope
→ bean instance gắn với HTTP session
```

Không nên biến thành:

```text
request scope = mỗi Thread một object
session scope = mỗi Thread một object
```

Request và Thread là hai lifecycle khác nhau. Async processing có thể chuyển execution sang Thread khác; framework dùng context/proxy để resolve scoped object theo request semantics chứ không phải vì bean "thuộc" một worker thread.

Đặc biệt, session-scoped mutable state không tự động thread-safe: cùng một user/session có thể có nhiều request concurrent. Bean scope không thay thế synchronization hoặc thiết kế tránh shared mutable state.
