The core mechanism does not mutate an already-created object. It processes **class-file bytes**. ClassFileTransformer receives class context plus the byte array representing the class file. It can:

1. return null to keep the current bytes;
2. return another valid class-file byte array;
3. throw IllegalClassFormatException when the input cannot be processed correctly.

On first load, transformation happens before the definition is installed. For already-loaded classes, redefinition and retransformation provide separate modification flows, still constrained by JVM rules.

Conceptually, a timing agent transforms:

~~~text
OrderService.placeOrder()
~~~

into:

~~~text
record start time
try
    execute original bytecode
finally
    record duration
~~~

Libraries such as ASM or Byte Buddy can help produce the replacement bytes, but they are **not the Instrumentation API**. Instrumentation supplies the lifecycle and hooks; bytecode tools implement the transformation.
