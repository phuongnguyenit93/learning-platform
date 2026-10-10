`resolve()` resolve root modules và dependency graph thông thường.

`resolveAndBind()` thực hiện resolution **kèm service binding**: với service được modules trong graph `uses`, resolution có thể kéo module provider phù hợp vào configuration.

Ví dụ:

```java
Configuration config = parent.configuration()
        .resolveAndBind(
                finder,
                ModuleFinder.of(),
                Set.of("com.example.report.host"));
```

Nếu host module `uses com.example.export.ReportExporter`, và plugin modules trong finder `provides` service đó, service binding cho phép provider modules tham gia graph mà host không `requires` trực tiếp từng provider.

Đây là điểm kết nối JPMS service model với runtime extensibility.

Không dùng `resolveAndBind()` như “scan mọi module và load hết”. Nó vẫn chịu module observability/resolution rules và bắt đầu từ roots/parents/finder đã chỉ định.
