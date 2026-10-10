A traditional thread dump usually contains a block for each platform thread: name, id, state, stack frames, and lock/monitor annotations.

Simplified example:

~~~text
"worker-1" #31 ... RUNNABLE
   java.lang.Thread.State: RUNNABLE
        at com.example.OrderService.calculate(OrderService.java:84)
        at ...
~~~

Monitor annotations may conceptually show:

~~~text
- waiting to lock <0x...>
- locked <0x...>
- waiting on <0x...>
~~~

A useful reading order is:

1. identify whether the thread name/id belongs to the workload;
2. inspect the state;
3. read the top stack frames;
4. inspect lock/monitor relationships;
5. compare with other threads and later snapshots.

A stack frame reports **where the thread was observed**; it does not prove that frame is the root cause.
