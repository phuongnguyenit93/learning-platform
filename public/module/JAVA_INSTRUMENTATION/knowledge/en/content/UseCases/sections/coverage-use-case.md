A coverage agent injects markers/counters to learn which code executed.

Conceptually:

~~~java
if (condition) {
    // probe A
    process();
} else {
    // probe B
    fallback();
}
~~~

A transformer may place probes at:

- method entry;
- basic blocks;
- branches;
- line-mapping points.

After the test run, a helper runtime maps probe IDs into a coverage report.

The challenge is not only incrementing counters. The agent must preserve:

- useful line/debug attributes;
- valid control flow;
- exception paths;
- a policy for generated/synthetic code;
- correct probe storage across class loaders.

Coverage is a strong example of additive instrumentation: business results should remain unchanged while observation data is added.
