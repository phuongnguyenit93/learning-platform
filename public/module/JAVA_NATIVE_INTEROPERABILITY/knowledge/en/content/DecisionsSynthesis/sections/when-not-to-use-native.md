Do not use native interoperability merely because an API looks “lower level” or because of an unmeasured assumption that native code will be faster.

Prefer managed Java when:

- the JDK or a Java library already provides the required capability;
- the native benefit is small but the deployment matrix is large;
- the team cannot control or validate the native binary versions;
- failure isolation matters more than a small performance gain;
- the workload is dominated by I/O or networking rather than the native computation itself.

Crossing the boundary also has overhead and makes profiling and debugging more difficult. Accept that cost only when the native side provides a capability or measurable benefit that justifies it.

“Do not use native interoperability here” is a valid engineering conclusion.
