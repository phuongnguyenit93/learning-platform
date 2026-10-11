Controller:

```text
AroundAdviceController#exceptionPropagation()
```

Endpoint:

```text
GET /aop/around/exception
```

Target cố ý ném:

```text
IllegalStateException("intentional-around-demo-error")
```

Aspect quan sát exception nhưng **rethrow** thay vì swallow:

```text
around:exception-before-proceed
target:throwsFailure
around:exception-observed=IllegalStateException
around:exception-finally
```

Điểm cần học:

```text
catch exception trong @Around
≠
bắt buộc phải chuyển exception thành success
```

Giữ nguyên propagation thường là behavior ít bất ngờ hơn nếu Aspect chỉ đang logging/metrics/auditing.

---

### Còn việc gọi proceed() nhiều lần?

Về mặt kỹ thuật `@Around` có thể thay đổi control flow rất sâu, nhưng module không biến việc gọi `proceed()` nhiều lần thành một pattern khuyến nghị. Nếu làm vậy, target có thể thực thi nhiều lần và tạo side effect lặp.

Điều cần nhớ là `proceed()` đại diện cho **tiếp tục invocation chain**, không phải một callback vô hại có thể gọi tùy ý.

---
