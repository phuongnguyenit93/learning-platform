A compatibility contract is the set of assumptions that lets a host and plugin continue to work together across versions.

It is broader than “the code still compiles”:

```text
binary compatibility
→ existing classes/method references still link

source compatibility
→ old provider source can still compile

semantic compatibility
→ API meaning has not changed incompatibly

configuration/data compatibility
→ required configuration and data contracts still work
```

Adding an SPI method may affect source/binary compatibility. Keeping the same signature while changing the meaning of `supports()` can be a semantic break.

A host-plugin contract should make important assumptions explicit, including:

- API or capability version;
- lifecycle expectations;
- threading and resource rules;
- error behavior;
- required and optional features.

`ServiceLoader` does not validate this application compatibility for you. It only enforces the Java service-provider loading rules.
