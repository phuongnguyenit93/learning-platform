ClassFileTransformer là quy ước callback giữa chuỗi Instrumentation của JVM và code biến đổi bytecode của agent. Sau khi transformer được đăng ký bằng Instrumentation.addTransformer(), JVM có thể gọi transform khi:

- class được định nghĩa lần đầu;
- class được redefine;
- class được retransform, nếu transformer được đăng ký với canRetransform=true.

Điểm cần nhớ: transformer chạy **trước khi định nghĩa class mới được JVM kiểm tra và áp dụng**. Vì vậy đầu ra của transformer phải là class-file bytes hợp lệ và phải phù hợp với loại thao tác đang diễn ra.

Một transformer tối thiểu:

~~~java
final class TimingTransformer implements ClassFileTransformer {
    @Override
    public byte[] transform(
            Module module,
            ClassLoader loader,
            String className,
            Class<?> classBeingRedefined,
            ProtectionDomain protectionDomain,
            byte[] classfileBuffer) {

        if (!"com/example/OrderService".equals(className)) {
            return null;
        }
        return transformOrderService(classfileBuffer);
    }
}
~~~
