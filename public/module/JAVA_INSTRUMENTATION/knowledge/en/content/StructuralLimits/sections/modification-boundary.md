Once a class is loaded, it is no longer “an arbitrary byte file that can be replaced with any schema.” The JVM is already maintaining:

- Class identity;
- resolved runtime metadata;
- field layout;
- method descriptors;
- active stack frames;
- instances and static state;
- current inheritance/module/class-loader relationships.

Redefine/retransform therefore allow only changes compatible with existing runtime state.

Mental model:

~~~text
method implementation
→ can change within supported limits

class shape / object layout / inheritance identity
→ largely must remain stable
~~~

Instrumentation is powerful for **changing implementation/inserting probes**, not for hot-migrating arbitrary type schemas.
