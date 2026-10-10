The whole module can be assembled into one flow:

~~~text
1. package agent JAR
        ↓
2. choose launch path
   -javaagent / Launcher-Agent-Class / dynamic attach
        ↓
3. JVM calls premain or agentmain
        ↓
4. receive Instrumentation
        ↓
5. check capabilities + install transformer
        ↓
6. target class load/redefine/retransform
        ↓
7. transformer receives class-file bytes
        ↓
8. bytecode tool emits valid transformed bytes
        ↓
9. JVM verifies + links + installs definition
        ↓
10. probes/helper runtime execute
        ↓
11. operate safely: overhead, loader/module visibility, policy
        ↓
12. remove/rollback/retransform when needed
~~~

If the learner can explain every arrow, identify where failures can occur, and know which topics must be handed off, the mental model is strong enough for later API experiments, Quiz, and Interview work.
