# Choosing the Simplest Correct I/O Abstraction

Java has several I/O APIs because different problems need different abstractions. The goal is not to memorize one “most powerful” API. Choose the simplest layer that still represents the payload, data size, access pattern, and resource lifetime correctly.

A useful decision sequence is:

~~~text
Are we handling bytes, text, or structured binary data?
→ is the data small and bounded, or potentially large?
→ sequential processing or random access/Channel behavior?
→ what byte order/framing does the binary format define?
→ which charset?
→ who owns the resource?
→ what partial state can remain after failure?
→ is there measured evidence that performance needs tuning?
~~~
