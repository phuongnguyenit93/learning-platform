An interpreter can begin executing bytecode immediately without first compiling every method to native machine code. That improves startup behavior and avoids expensive compiler work for methods that execute only a few times.

The trade-off is straightforward:

```text
interpreter
→ low startup cost
→ early runtime profiling
→ usually lower peak speed than optimized native code
```

HotSpot uses interpretation as part of a larger adaptive strategy; Java is not simply “an interpreted language.”

In a long-running service, hot paths may spend most of their time in compiled code while cold paths remain interpreted or lightly optimized.
