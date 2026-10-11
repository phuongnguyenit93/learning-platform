### What is Process?

A process is a program that is executing and has its own resource space managed by the operating system.

For example:

- IntelliJ IDEA is running as a process.
- A JVM running a Spring Boot application is a process.
- Chrome can use multiple processes for different tabs or components.

Processes are isolated from each other. If they want to exchange data, they usually have to use an IPC mechanism such as sockets, pipes, files, or shared memory.

### What is Thread?

A thread is an execution thread inside a process.

A JVM process usually has multiple threads that coexist:

```text
JVM Process
│
├── Main Thread
├── HTTP worker thread
├── GC thread
├── Scheduler Thread
└── Other Threads
```

Threads in the same process can access the same objects in the process heap. Each thread also has its own execution stack to store the call stack and local data of that execution.

It is important to:

```text
Multiple Threads
    ↓
Shared Mutable State can be accessed together
    ↓
Concurrency Problem may appear
```

Race condition, visibility, ordering, and synchronization will be learned in the following sections. In the Basic section, just keep in mind that just because multiple threads see the same object does not mean that it is always safe to access that object.

### What's the difference between Process and Thread?

| Characteristics | Process | Thread |
| --- | --- | --- |
| Scope | A running program | An execution thread inside the process |
| Memory space | Have your own address space | Same process, so you can access the same heap |
| Stack | A process can contain multiple threads, each with its own stack | Each thread has its own stack |
| Communication | Usually IPC Required | Can Communicate via Shared Object |
| Creation/conversion costs | Usually larger than threads | Usually lighter than process |
| Concurrency risk | Better isolation between processes | Prone to errors when sharing mutable state |

### Demo in module

Refer to the controller:

```text
BasicThreadController#processAndThread()
```

Endpoint:

```text
GET /basic/process-thread
```

When running this endpoint, the response returns:

- PID of the current JVM process.
- The name of the thread that is processing the HTTP request.
- The ID of that thread.
- Is that Thread a daemon or not.
- The current state of the thread.

The point to observe is **an HTTP request that does not exist independently**. It is being executed by a specific thread inside the JVM process.

**Final Thoughts** A process is a range of resources and multiple threads; a thread is an execution flow that is actually running code within that process.
