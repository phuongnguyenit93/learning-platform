Version negotiation lets host and plugin decide whether they can collaborate and at what capability level.

A simple descriptor might expose:

```java
interface PluginDescriptor {
    int apiMajor();
    int apiMinor();
}
```

The host can apply policy such as:

```text
different major
→ reject

same major, older minor
→ allow when required capabilities are still present
```

A version number alone is rarely sufficient. Two plugins both labeled `2.1` may expose different optional capabilities or environment constraints.

Negotiation is usually stronger when it combines:

```text
contract version
+ capability set
+ environment constraints
+ host policy
```

Perform validation before activation so incompatibility fails predictably instead of on the first business request.

Semantic Versioning or another version scheme is an application decision; Java does not define a universal host-plugin negotiation policy.
