NMT is not free. Oracle documents an approximately **5–10% performance overhead** when tracking is enabled; NMT also adds tracking metadata to allocations it observes. Production use should therefore be intentional.

Common mistakes include:

- trying to enable NMT after the incident has already begun;
- confusing reserved with committed;
- expecting NMT totals to equal RSS;
- diagnosing third-party native leaks from a mechanism that does not fully track them;
- treating one snapshot as proof of a leak;
- enabling detail everywhere without a question that requires it.

NMT is a HotSpot diagnostic feature, not a Java-language abstraction. Hand off to JVM internals for deeper VM-category interpretation and to Native Interoperability when JNI/FFM or third-party native allocation becomes the likely source.
