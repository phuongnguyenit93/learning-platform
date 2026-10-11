Không có TCCL, một thư viện chỉ dùng loader định nghĩa chính nó có thể gặp:

```text
Framework class
→ do parent loader định nghĩa

PluginProvider
→ chỉ child/plugin loader nhìn thấy

framework hỏi defining loader của chính nó
→ không thấy PluginProvider
```

TCCL cho framework một loader do thread context cung cấp:

```java
ClassLoader contextLoader =
        Thread.currentThread().getContextClassLoader();
```

Cách hiểu:

```text
defining ClassLoader
→ identity/quyền sở hữu class

Thread Context ClassLoader
→ lookup context gắn với thread cho tình huống tìm provider/resource
```

TCCL **không thay đổi defining loader của class đã tồn tại**. Nó chỉ là một reference tới loader mà code có thể chọn dùng.

### Vì sao ClassLoader định nghĩa của khung phần mềm không tìm thấy thành phần cung cấp (provider) nhưng TCCL lại tìm thấy?

Giả sử framework được parent loader định nghĩa, còn provider chỉ có child loader nhìn thấy:

```text
framework defining loader
→ nhìn parent/shared namespace
→ không thấy PaymentPlugin ở child

thread context ClassLoader = PluginClassLoader
→ nhìn thấy PaymentPlugin/provider metadata
→ discovery có thể thành công
```

Đây là WHY cốt lõi của TCCL: nó cho code đang chạy một **lookup context khác với defining loader của chính framework** khi kiến trúc cần nhìn xuống application/plugin layer.
