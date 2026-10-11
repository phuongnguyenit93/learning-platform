Java 21 has two thread categories with important observability differences.

**Platform threads**  
ThreadMXBean monitors and manages them. Traditional dumps and jcmd Thread.print fit ordinary platform-thread counts.

**Virtual threads**  
They may exist in very large numbers. Java 21 ThreadMXBean does **not** monitor or manage virtual threads.

To dump both platform and virtual threads:

~~~text
jcmd <pid> Thread.dump_to_file -format=text threads.txt
jcmd <pid> Thread.dump_to_file -format=json threads.json
~~~

Oracle notes that this format does not contain all information present in traditional thread dumps, such as object addresses and some lock/JNI/heap statistics.

JFR adds virtual-thread-specific evidence such as VirtualThreadPinned and VirtualThreadSubmitFailed. For virtual-thread-heavy applications, JFR and thread-dump evidence are complementary.
