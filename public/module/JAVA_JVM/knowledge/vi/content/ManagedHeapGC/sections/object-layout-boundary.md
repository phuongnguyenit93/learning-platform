JVMS cố ý không quy định biểu diễn vật lý của object. Một implementation được tự do chọn header, alignment, field placement, pointer compression và nhiều chi tiết khác miễn semantics có thể quan sát vẫn đúng.

HotSpot thường có object header và alignment rules, nhưng các con số cụ thể phụ thuộc version, architecture và VM configuration.

Vì vậy các câu kiểu:

```text
mọi object Java = header X bytes + fields
```

chỉ đúng trong một ngữ cảnh implementation cụ thể.

Khi cần memory-sizing chính xác, hãy ghi rõ:

```text
HotSpot version
architecture
compressed-oops setting
alignment
```

Module JVM dạy ranh giới này để người học không biến output của một tool trên một máy thành quy luật chung.
