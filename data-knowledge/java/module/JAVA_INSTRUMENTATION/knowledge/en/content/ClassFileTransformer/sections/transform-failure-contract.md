If transform() throws an uncaught exception, **subsequent transformers are still called** and the JVM still attempts the load/redefine/retransform. For that transformer, the effect is essentially the same as returning null.

Therefore, throwing RuntimeException is not a reliable way to “stop the pipeline.”

A defensive pattern is:

~~~java
try {
    return transformerEngine.transform(classfileBuffer);
} catch (Throwable ex) {
    agentLogger.error("Transform failed for " + className, ex);
    return null;
}
~~~

Catching Throwable is not a default recommendation for ordinary application code, but ClassFileTransformer documentation explicitly calls it out as a way to prevent unexpected unchecked failures in transformer code.

IllegalClassFormatException remains useful when the input truly is malformed because it improves logging/debugging even though transformation processing can continue.
