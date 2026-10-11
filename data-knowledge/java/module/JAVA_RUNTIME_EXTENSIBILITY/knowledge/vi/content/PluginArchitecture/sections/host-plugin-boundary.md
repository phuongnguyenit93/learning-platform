Host và plugin nên có trách nhiệm tách biệt.

Host thường sở hữu:

- discovery context;
- selection policy;
- lifecycle orchestration;
- logging/metrics boundary;
- timeout/cancellation policy;
- failure containment;
- shared service contract.

Plugin thường sở hữu:

- implementation detail;
- private dependencies;
- capability-specific resource;
- cleanup cho resource nó tạo ra;
- domain behavior của extension.

Một anti-pattern là host can thiệp sâu vào implementation:

```java
PdfExporter pdf = (PdfExporter) plugin;
pdf.getInternalEngine().reset();
```

Khi đó plugin boundary không còn thật sự tồn tại.

Ngược lại, plugin cũng không nên tự ý điều khiển toàn host lifecycle hoặc giữ global mutable state nếu contract không cho phép.

Boundary tốt giúp thay provider mà không kéo thay đổi implementation detail sang host.
