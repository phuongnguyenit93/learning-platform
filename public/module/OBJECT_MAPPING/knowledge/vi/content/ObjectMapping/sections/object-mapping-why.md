Một model thường không nên phục vụ mọi boundary cùng lúc.

Database entity có concern về persistence, API DTO có concern về contract bên ngoài, còn domain model có concern về business invariant.

Nếu dùng chung một class cho tất cả, thay đổi ở một boundary dễ leak sang boundary khác.

Object Mapping cho phép mỗi model giữ responsibility riêng nhưng vẫn chuyển dữ liệu giữa chúng.
