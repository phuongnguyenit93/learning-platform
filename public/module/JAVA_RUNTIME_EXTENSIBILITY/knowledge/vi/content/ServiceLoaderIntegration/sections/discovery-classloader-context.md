Overload phổ biến nhất:

```java
ServiceLoader.load(ReportExporter.class)
```

tương đương việc dùng **thread context class loader** hiện tại làm điểm bắt đầu discovery.

Điều này quan trọng trong container/plugin environment, nơi code host có thể được load bởi một loader nhưng extension lại chỉ visible từ context loader khác.

Khi cần kiểm soát rõ context, dùng overload:

```java
ClassLoader pluginLoader = ...;

ServiceLoader<ReportExporter> loader =
        ServiceLoader.load(ReportExporter.class, pluginLoader);
```

Class-loader based discovery không chỉ là “scan một folder”. Java phải tôn trọng visibility, parent delegation, named modules gắn với loader/layer và provider-configuration resources của unnamed modules.

Một hệ quả thực tế: không nên cache kết quả của `ServiceLoader.load(service)` ở phạm vi toàn JVM nếu application có nhiều context class loader khác nhau. Provider visible với application A có thể không phù hợp hoặc không visible với application B.

Nếu architecture cần plugin class-loader isolation, hãy coi loader context là một phần explicit của plugin boundary thay vì phụ thuộc ngầm vào thread context loader ở mọi nơi.
