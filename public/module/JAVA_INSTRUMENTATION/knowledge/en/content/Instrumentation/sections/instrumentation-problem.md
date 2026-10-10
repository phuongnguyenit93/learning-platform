Suppose a tool must measure every call to OrderService.placeOrder() across applications that are already built. Editing source directly would be straightforward:

~~~java
public Order placeOrder(Request request) {
    long start = System.nanoTime();
    try {
        return doPlaceOrder(request);
    } finally {
        metrics.record(System.nanoTime() - start);
    }
}
~~~

That approach does not work well for a profiler/APM agent, for code you do not own, or for a policy that must cover thousands of classes. Reflection can inspect and invoke members dynamically, while proxies can intercept calls that cross a proxy boundary. Neither gives a general hook into the **class-definition pipeline**.

Instrumentation fills that gap:

- logic is packaged in an agent instead of scattered through applications;
- transformers can select classes by name, loader, and module context;
- probes can be injected at class-load time;
- with the appropriate capabilities, already-loaded classes can be retransformed or redefined.

The trade-off is reach. An agent runs close to the JVM and can have a large blast radius. Invalid transformation may fail verification/linkage or destabilize the application, so capability must always be learned together with constraints and operational safety.
