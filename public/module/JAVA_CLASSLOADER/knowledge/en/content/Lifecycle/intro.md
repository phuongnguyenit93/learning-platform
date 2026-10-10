# What Is a ClassLoader? From Class Bytes to a Usable Runtime Type

Java source code cannot execute merely because a `.class` file exists somewhere on disk. The JVM executes runtime types, represented by `Class<?>` objects, and it needs a controlled process that can locate class bytes, turn them into runtime classes, connect their symbolic references, and initialize their static state.

A **JAR** is simply a common archive format used to package Java class files and resources. You do not need its internal format for this module; the important point is that class bytes may live inside an archive rather than as standalone files.

This chapter establishes that process first. The rest of the module then explains who performs the loading, how loaders cooperate, how loader identity affects type identity, how frameworks cross loader boundaries, how resources are found, and why loaders can become memory-leak roots.

> **Prerequisite bridge:** this module assumes you already know that Java exposes a runtime type through `Class<?>`. If `Class<?>`, runtime type metadata, or reflection are still unfamiliar, review the `class-object` and `reflection` modules first. Here, `Class<?>` is used only as the runtime representation of a type so the focus can stay on how that type enters the JVM.
