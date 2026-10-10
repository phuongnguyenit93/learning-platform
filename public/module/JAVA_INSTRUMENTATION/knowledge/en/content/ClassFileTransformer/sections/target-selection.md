A good transformer **filters early**. Parsing every class before deciding whether it is a target increases startup cost and risk.

~~~java
if (className == null) {
    return null;
}
if (!className.startsWith("com/example/order/")) {
    return null;
}
if (loader == null) {
    return null; // skip bootstrap classes for this agent
}
if (module != null && module.isNamed()
        && !"com.example.app".equals(module.getName())) {
    return null;
}
~~~

Real filters often include:

- package/class allowlists;
- denylists for agent/helper/tooling classes;
- class-loader identity/type;
- module name;
- marker annotation/interface when metadata is available;
- current agent enabled/disabled state.

Target selection is part of correctness, not merely a performance optimization.
