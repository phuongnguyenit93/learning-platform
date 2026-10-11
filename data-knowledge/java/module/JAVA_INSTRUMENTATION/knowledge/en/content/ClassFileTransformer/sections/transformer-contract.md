ClassFileTransformer is the callback contract between the JVM Instrumentation pipeline and an agent's bytecode transformation code. After registration through Instrumentation.addTransformer(), the JVM can invoke transform when:

- a class is defined for the first time;
- a class is redefined;
- a class is retransformed, when the transformer was registered with canRetransform=true.

The key point is that a transformer runs **before the new class definition is verified and applied by the JVM**. Its output must therefore be a valid class file and must respect the semantics of the current operation.

A minimal transformer:

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
