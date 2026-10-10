Compatibility phải được test như một **matrix**, vì lỗi thường chỉ xuất hiện ở tổ hợp host/provider cụ thể.

Ví dụ:

```text
Host 2.0 × Plugin 1.8 → supported
Host 2.0 × Plugin 2.0 → supported
Host 2.0 × Plugin 3.0 → rejected
```

Test nên bao gồm:

- discovery từ artifact thật;
- contract method invocation;
- capability negotiation;
- lifecycle start/stop;
- old provider với new host;
- new provider với minimum supported host;
- dependency/class-loader isolation nếu có;
- invalid/incompatible provider phải bị reject rõ.

Contract test có thể chạy cho mọi provider implementation dùng cùng test suite.

Ngoài unit test, hãy có integration test dùng JAR/module packaging thật vì lỗi `META-INF/services`, module descriptor và class-loader visibility không xuất hiện nếu test chỉ `new Provider()` trực tiếp.
