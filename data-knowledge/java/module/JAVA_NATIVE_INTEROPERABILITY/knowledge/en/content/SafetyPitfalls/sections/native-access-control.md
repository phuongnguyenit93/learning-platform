Java 21 has **two separate gates** that are easy to confuse.

First, FFM is a preview API, so compilation and execution need preview features enabled:

~~~bash
javac --release 21 --enable-preview NativeDemo.java
java --enable-preview NativeDemo
~~~

Second, some FFM methods are **restricted operations** because they can execute native code or weaken safety assumptions. In Java 21, if `--enable-native-access` is omitted entirely, those calls are still allowed but the runtime emits warnings. Once the option is present, only the listed modules are granted native access; a restricted call from a caller outside that set is rejected with `IllegalCallerException`. Native access should therefore be granted to the specific modules that actually perform restricted operations.

For code on the class path:

~~~bash
java --enable-preview \
     --enable-native-access=ALL-UNNAMED \
     NativeDemo
~~~

Do not interpret --enable-native-access as “turning on FFM.” Preview enablement and native-access declaration are separate concerns. For named modules, grant native access only to the modules that actually need restricted operations.
