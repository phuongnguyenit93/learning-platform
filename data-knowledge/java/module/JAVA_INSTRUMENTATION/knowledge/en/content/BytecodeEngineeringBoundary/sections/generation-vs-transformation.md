**Generation** and **transformation** are related but different.

Generation:

~~~text
no previous class definition
→ build a new class from a model/builder
→ emit byte[]
~~~

Transformation:

~~~text
existing class-file bytes
→ preserve most structure
→ replace a subset
→ emit new byte[]
~~~

Java agents usually need transformation because the target class belongs to an application. A bytecode tool may still generate helper, proxy, or auxiliary classes.

This module's boundary is:

- understand transformation well enough to instrument methods correctly;
- understand generation well enough to distinguish use cases;
- do not turn Instrumentation into a general compiler/code-generation course.

Generating a new helper also does **not** bypass structural limits when the goal is to redefine an already-loaded target class.
