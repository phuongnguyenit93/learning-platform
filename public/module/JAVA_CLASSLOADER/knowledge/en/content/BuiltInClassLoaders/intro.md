# Built-In ClassLoaders

A normal Java 21 application already has a loader hierarchy before application code creates any custom loader. Understanding these built-in loaders gives a concrete answer to "which ClassLoader defines/owns this runtime class?" and prepares the parent-delegation model used in the next chapter.

Why not use one global loader for everything? Separate ownership boundaries keep **core JDK classes**, **platform classes**, and **application classes** in predictable layers. That gives foundational types stable ownership and lets later custom loaders choose what to share through a parent and what to isolate in a child namespace.
