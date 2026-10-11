Để ghép toàn bộ mô hình tư duy, xem một luồng tối thiểu từ đầu đến cuối.

Annotation phía ứng dụng:

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.SOURCE)
public @interface GenerateMapper {
}
```

Mã nguồn sử dụng Annotation:

```java
@GenerateMapper
class Order {
}
```

Processor tìm phần tử được gắn Annotation và sinh type mới:

```java
public final class MapperProcessor extends AbstractProcessor {

    @Override
    public boolean process(
            Set<? extends TypeElement> annotations,
            RoundEnvironment roundEnv) {

        for (Element element :
                roundEnv.getElementsAnnotatedWith(GenerateMapper.class)) {

            String generatedName =
                element.getSimpleName() + "MapperGenerated";

            try {
                JavaFileObject file =
                    processingEnv.getFiler()
                        .createSourceFile(generatedName, element);

                try (Writer writer = file.openWriter()) {
                    writer.write(
                        "final class " + generatedName + " {}"
                    );
                }
            } catch (IOException e) {
                processingEnv.getMessager().printMessage(
                    Diagnostic.Kind.ERROR,
                    e.getMessage(),
                    element
                );
            }
        }

        return true;
    }
}
```

Luồng quan sát được:

```text
@GenerateMapper trên Order
→ roundEnv tìm thấy Order
→ processor gọi Filer
→ sinh OrderMapperGenerated.java
→ đóng file
→ trình biên dịch thấy mã nguồn được sinh ở vòng sau
→ mã nguồn được sinh được biên dịch như mã Java bình thường
```

`Filer` cung cấp API chuẩn:

```java
JavaFileObject file =
    processingEnv.getFiler()
        .createSourceFile("com.example.OrderMapperGenerated", sourceElement);

try (Writer writer = file.openWriter()) {
    writer.write("""
        package com.example;

        final class OrderMapperGenerated {
        }
        """);
}
```

Sau khi đầu ra được đóng, mã nguồn được sinh có thể tham gia vòng tiếp theo và cuối cùng được biên dịch như mã Java bình thường.

`Filer` còn có thể tạo class file hoặc tài nguyên.

Khi có phần tử nguồn tương ứng, nên truyền nó cho `Filer` nếu phù hợp để công cụ build có thêm thông tin phụ thuộc.

Lỗi/cảnh báo kiểm tra hợp lệ nên được phát qua `Messager`:

```java
processingEnv.getMessager().printMessage(
    Diagnostic.Kind.ERROR,
    "@GenerateMapper requires a class",
    element
);
```

Mã được sinh không phải “phép màu lúc chạy”. Nó là đầu ra được tạo trong quá trình build và phải biên dịch/hoạt động như mã nguồn bình thường.
