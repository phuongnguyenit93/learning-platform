Nếu transform() ném exception không được bắt, **các transformer tiếp theo vẫn được gọi** và JVM vẫn cố tiếp tục nạp/redefine/retransform. Theo quy ước, hiệu ứng gần tương đương return null đối với transformer đó.

Vì vậy nếu muốn agent dừng phép instrumentation cho một class mục tiêu khi gặp lỗi, chỉ ném RuntimeException không đủ để “dừng chuỗi biến đổi”.

Một mẫu an toàn:

~~~java
try {
    return transformerEngine.transform(classfileBuffer);
} catch (Throwable ex) {
    agentLogger.error("Transform failed for " + className, ex);
    return null;
}
~~~

Bắt Throwable không phải quy tắc mặc định cho mã ứng dụng, nhưng tài liệu ClassFileTransformer nêu đây là lựa chọn để tránh lỗi unchecked bất ngờ trong transformer.

IllegalClassFormatException hữu ích khi đầu vào thực sự sai định dạng vì nó giúp công cụ/ghi log nhận biết đây là lỗi định dạng, dù ngữ nghĩa của chuỗi biến đổi vẫn cho phép phần còn lại tiếp tục.
