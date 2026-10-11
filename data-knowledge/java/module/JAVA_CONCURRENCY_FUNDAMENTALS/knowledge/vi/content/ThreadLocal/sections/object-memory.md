Object Java như entity, DTO, collection vẫn là object trên heap.

Thread có stack riêng chứa frame/local reference, nhưng việc một reference là local variable không tạo ra một "local heap" riêng cho object.

Thread safety phụ thuộc object có bị shared/reachable từ nhiều Thread và có mutable state hay không.

JPA persistence context / transaction isolation là framework/database semantics riêng; không nên giải thích chúng bằng khái niệm "mỗi Thread có heap riêng".
