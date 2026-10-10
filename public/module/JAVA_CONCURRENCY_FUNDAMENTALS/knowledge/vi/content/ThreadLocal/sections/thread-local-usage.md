Các use case phổ biến:

- request/correlation id;
- logging MDC (bản thân MDC thường dựa trên thread-bound context);
- security/request context trong framework;
- transaction/session context do framework quản lý.

Không nên dùng ThreadLocal để biến mọi parameter thành implicit global state. Explicit parameter thường dễ test và reasoning hơn nếu context không thực sự cần thread-bound semantics.
