Nạp động xảy ra sau khi JVM/ứng dụng đã chạy. Agent JAR phải có Agent-Class và agent class phải khai báo agentmain:

~~~java
public static void agentmain(String agentArgs, Instrumentation inst) {
    if (!inst.isRetransformClassesSupported()) {
        throw new IllegalStateException("Retransformation is required");
    }
    inst.addTransformer(new TimingTransformer(), true);
}
~~~

Khác startup agent, dynamic agent đến **sau** khi nhiều class đã được nạp. Nếu muốn áp dụng phép biến đổi cho chúng, agent thường phải:

1. đăng ký transformer có canRetransform phù hợp;
2. tìm class mục tiêu trong getAllLoadedClasses();
3. kiểm tra isModifiableClass();
4. gọi retransformClasses() hoặc dùng redefineClasses() theo trường hợp sử dụng.

Nạp động hữu ích cho công cụ chạy theo nhu cầu, nhưng làm tăng yêu cầu về kiểm tra khả năng, rollback và chính sách kiểm soát attach.
