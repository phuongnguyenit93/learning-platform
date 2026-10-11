This part must be tied to the version because the implementation virtual thread changes through the JDKs.

In **Java 2.**, the virtual thread can be pinned to the carrier in some cases, notably when blocking while holding the monitor `synchronized`, or through some native/foreign operations.

Short pinning does not mean correctness error, but long/frequent blocking in the pinned state can reduce scalability because the carrier is not released.

This rule should not be made a permanent truth for any newer JDK; always check the behavior/version being deployed.
