JVM Specification mô tả những gì một JVM phải đảm bảo ở mức hợp đồng: class-file format, runtime data areas theo mô hình logic, instruction semantics, quy tắc loading/linking/initialization, frames, exceptions và nhiều quy tắc khác.

Một cách triển khai JVM như HotSpot phải hiện thực hợp đồng đó, nhưng có quyền lựa chọn nhiều chi tiết:

- object layout thực tế;
- garbage collector;
- JIT strategy;
- internal memory layout;
- code cache organization;
- thresholds và heuristics;
- VM flags riêng của implementation.

Ví dụ, specification nói JVM có heap dùng cho object/array và heap được quản lý tự động; specification **không bắt buộc** heap phải chia young/old generation hay phải dùng G1.

Tương tự, JVM không “vốn là interpreted”. Specification cho phép implementation interpret bytecode, compile bytecode thành machine code hoặc kết hợp nhiều chiến lược miễn semantics được giữ.

Quy tắc học quan trọng:

> Cái gì được đảm bảo bởi specification thì có tính portable cao hơn; cái gì đến từ tài liệu HotSpot phải được xem là hành vi của một implementation cụ thể.
