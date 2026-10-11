Nếu application phụ thuộc trực tiếp vào API riêng của từng ORM provider, entity lifecycle, query API và persistence behavior sẽ bị khóa mạnh vào implementation.

JPA tạo một contract chuẩn cho các concept như entity, persistence context, EntityManager, mapping, query và lifecycle.
