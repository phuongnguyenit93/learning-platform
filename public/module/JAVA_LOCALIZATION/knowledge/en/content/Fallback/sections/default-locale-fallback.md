The default `ResourceBundle` lookup process can also consult the JVM's **default locale** when an appropriate bundle for the requested target locale cannot be found.

That makes the default locale a hidden dependency if the application has not defined a clear fallback policy.

For example:

```text
request asks for fr-FR
        ↓
French bundle is unavailable
        ↓
JVM default is en-US
        ↓
lookup may reach English resources through fallback policy
```

The application may avoid an exception yet still show the user an unexpected language.

When product requirements need strict behavior, fallback can be controlled explicitly:

```java
ResourceBundle.Control control = ResourceBundle.Control.getNoFallbackControl(
        ResourceBundle.Control.FORMAT_DEFAULT
);

ResourceBundle bundle = ResourceBundle.getBundle(
        "Messages",
        locale,
        control
);
```

Do not customize fallback merely because the API permits it. First define the product rule: should an unsupported locale fall back to a language-only bundle, a fixed product default, the base bundle, or an error?
