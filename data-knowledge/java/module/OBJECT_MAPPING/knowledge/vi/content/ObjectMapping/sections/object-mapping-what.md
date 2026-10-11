Object Mapping là quá trình chuyển dữ liệu từ một object model sang một object model khác nhưng vẫn giữ hoặc biến đổi ý nghĩa dữ liệu theo contract mong muốn.

Ví dụ:

```text
Entity → DTO
Domain Model → API Response
Request DTO → Command
External Model → Internal Model
```

Object Mapping không phải serialization. Hai phía vẫn là object model trong memory.
