When HotSpot encounters a fatal VM or native-level failure, it commonly writes a **fatal error log**. The default file name is typically hs_err_pid<PID>.log, and -XX:ErrorFile can configure its location.

A fatal error log brings several evidence layers together:

- the signal or exception that terminated the VM;
- the current thread at the failure point;
- related native and Java stacks;
- VM, heap, GC, and command-line information;
- loaded dynamic libraries;
- operating-system and CPU information;
- platform-dependent register or memory context.

Do not treat the “problematic frame” as automatic proof of root cause. It identifies where the crash surfaced. The real cause may be earlier memory corruption, a violated JNI contract, a faulty native library, or a VM defect.

A useful reading order is: confirm PID/time, inspect the header and problematic frame, classify the owning library, inspect current-thread stacks, review VM flags/environment, then decide whether core-dump or native-level analysis is required.
