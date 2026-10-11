A transformer has three practical outcomes.

**No change**

~~~java
return null;
~~~

The JVM keeps the current bytes.

**Change**

~~~java
return transformedBytes;
~~~

The contract says a transformer **should** create and return a new well-formed byte array when it performs a transformation; the strict requirement is that the input classfileBuffer must not be modified.

**Malformed input**

~~~java
throw new IllegalClassFormatException("...");
~~~

The output cannot be merely “close enough.” After the transformation chain, the JVM still verifies and links the class; format, version, or linkage problems can fail the overall operation.

Bytecode tools should parse/build their own representation and emit a new array, which also makes retransformation behavior easier to reason about.
