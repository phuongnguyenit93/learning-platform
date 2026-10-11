Khi function nằm trong một library cụ thể, SymbolLookup.libraryLookup giúp load library và tạo lookup chỉ cho library đó.

~~~java
try (Arena arena = Arena.ofConfined()) {
    SymbolLookup lookup =
            SymbolLookup.libraryLookup("mylib", arena);

    MemorySegment function = lookup.find("compute")
            .orElseThrow();
}
~~~

Library lookup gắn lifetime với Arena được truyền vào. Với closeable arena, đóng arena sẽ kết thúc lifetime của lookup/library association theo contract của API.

Trong Java 21, libraryLookup là restricted operation vì việc load native library có thể chạy native code ngay trong quá trình load. Vì vậy nó thuộc native-access boundary, tách biệt với việc chỉ bật preview API.
