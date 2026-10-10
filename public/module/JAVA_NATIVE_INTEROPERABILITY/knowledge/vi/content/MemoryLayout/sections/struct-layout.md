StructLayout mô tả các member được đặt **nối tiếp nhau** trong memory. Khi native ABI yêu cầu padding giữa member, layout phải biểu diễn padding đó rõ ràng.

Ví dụ C:

~~~c
struct TaggedValue {
    char kind;
    int value;
};
~~~

Một layout Java 21 tương ứng với trường hợp có 3 byte padding:

~~~java
StructLayout taggedValue = MemoryLayout.structLayout(
        ValueLayout.JAVA_BYTE.withName("kind"),
        MemoryLayout.paddingLayout(3),
        ValueLayout.JAVA_INT.withName("value")
);
~~~

Không nên giả định MemoryLayout.structLayout sẽ “đoán ABI C” cho mình. Padding/alignment phải phản ánh native contract thật. Sai một offset có thể khiến Java đọc nhầm field hoặc truyền structure hỏng cho native function.
