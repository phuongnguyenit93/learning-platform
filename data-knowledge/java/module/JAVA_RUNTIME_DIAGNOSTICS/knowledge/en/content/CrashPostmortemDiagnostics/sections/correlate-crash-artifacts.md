Postmortem evidence becomes much stronger when independent artifacts agree.

For a memory incident:

~~~text
OOME or growing process memory
        ↓
Do GC logs show a persistently full heap?
        ↓
Does the heap dump show dominant retained objects?
        ↓
Does JFR identify the allocation source?
        ↓
Does NMT show growth in a JVM native category?
~~~

For a native crash:

~~~text
hs_err problematic frame
        ↓
native stack from the core
        ↓
JFR/log context immediately before failure
        ↓
recent JNI or native-library change
~~~

Artifacts do not have to tell the same story. A disagreement can itself narrow the search: rising RSS with stable heap and NMT may point outside those scopes; a single “hot” stack that does not repeat may simply be a badly timed snapshot.

The goal is a hypothesis that evidence can falsify, not a collection of artifacts selected to support a conclusion already made.
