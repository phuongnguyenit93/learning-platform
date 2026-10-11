Java supports two common resource-bundle forms.

### `.properties` bundles

```text
Messages_en.properties
Messages_vi.properties
```

They are usually a good fit for translated messages because they keep text outside compiled Java code and work well with translation tooling.

### Class-based bundles

A class can extend `ListResourceBundle`:

```java
public class Messages_en extends ListResourceBundle {
    @Override
    protected Object[][] getContents() {
        return new Object[][] {
                {"order.created", "Order created"}
        };
    }
}
```

Class bundles can provide objects rather than only text values, but they couple the resource to Java compilation and source structure.

For ordinary message translation, `.properties` is typically simpler. Modern Java `PropertyResourceBundle` behavior supports UTF-8 resource content, while retaining compatibility behavior for older encodings. A project should still standardize its source/resource encoding explicitly across editors and build tooling.
