Interpreter có thể bắt đầu thực thi bytecode ngay mà không cần chờ compile toàn bộ method sang machine code. Điều này giúp startup nhanh hơn và tránh tốn compiler effort cho code chỉ chạy một vài lần.

Trade-off:

```text
interpreter
→ startup tốt
→ dễ quan sát hành vi runtime sớm
→ nhưng peak execution thường chậm hơn optimized native code
```

HotSpot dùng interpreter như một phần của adaptive strategy, không phải dấu hiệu rằng “Java luôn interpreted”.

Một ứng dụng chạy lâu có thể dành phần lớn execution time trong compiled code, trong khi cold path vẫn interpreted hoặc ít tối ưu hơn.
