A Java agent is commonly packaged as a dedicated JAR containing:

- an agent class with premain/agentmain;
- transformers and helper classes;
- a manifest that identifies the agent entry point;
- any dependencies required by the chosen packaging strategy.

Example:

~~~text
timing-agent.jar
├── META-INF/MANIFEST.MF
└── com/example/agent/
    ├── TimingAgent.class
    └── TimingTransformer.class
~~~

An agent JAR is not simply “imported by the application.” The JVM reads its manifest and loads the agent through the java.lang.instrument lifecycle. Because the agent shares the application process, packaging must account for dependency conflicts and class-loader visibility.

Under the package contract, classes in the agent JAR are loaded by the system class loader and belong to that loader's unnamed module. Helpers placed through Boot-Class-Path or appendToBootstrapClassLoaderSearch() live under different bootstrap-loader visibility. That distinction explains many failures where the main agent can see a helper but transformed code cannot resolve it.
