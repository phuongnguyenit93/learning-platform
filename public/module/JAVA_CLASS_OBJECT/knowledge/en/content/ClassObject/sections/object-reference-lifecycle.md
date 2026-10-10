A reference variable stores a **reference value**, not the object “inside the variable”. Several variables may refer to the same object.

An object may outlive a local variable if other reachable references still exist. Garbage collection is based on reachability rather than lexical scope alone.

External-resource lifetime is different: files and sockets require deterministic cleanup rather than waiting for GC.

The next chapter starts at object creation: what should a constructor establish before the object becomes usable?
