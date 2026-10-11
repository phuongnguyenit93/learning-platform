# Custom ClassLoaders and Isolation

Built-in loaders are enough when every class comes from the normal runtime, module path, or application class path. A custom ClassLoader becomes useful when the application needs a different **source of class bytes** or a deliberate **namespace boundary**: plugin directories, generated classes, container isolation, scripting engines, instrumentation tools, or similar runtime systems.

The important design question is not "how do I read a `.class` file?" It is "which classes should this loader define, which classes should it share with its parent, and how will that ownership affect type identity?"
