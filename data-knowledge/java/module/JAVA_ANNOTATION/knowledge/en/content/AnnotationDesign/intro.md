# When Should You Use Annotations?

After learning annotation syntax, custom annotation types, `@Retention`, `@Target`, meta-annotations, repeatability, inheritance, and annotation processing, the final question is no longer **“How do I write an annotation?”** It is:

> **Should this problem actually be represented with an annotation?**

Annotations are descriptive tools. They work well when information belongs close to source code, is relatively stable, and has a clear consumer. They become harmful when they hide too much configuration or control flow that an explicit API or configuration model would communicate more clearly.

This chapter synthesizes the module into an end-to-end design model.
