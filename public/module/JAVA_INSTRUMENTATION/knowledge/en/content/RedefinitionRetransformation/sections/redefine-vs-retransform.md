The core distinction is:

| | Redefine | Retransform |
| --- | --- | --- |
| caller supplies replacement bytes | yes | no |
| transformation pipeline involved | yes, on supplied definition | yes, with retransformation rules |
| retransformation-incapable transformer | invoked during redefine | not invoked again; previous result reused |
| natural fit | concrete replacement definition exists | recompute instrumentation for loaded class |

Practical rule:

~~~text
"I have specific class bytes I want to install"
→ redefine

"I want the instrumentation pipeline to recompute this loaded class"
→ retransform
~~~

Both require a modifiable class and both remain subject to structural constraints. Do not choose one merely because its name sounds more powerful.
