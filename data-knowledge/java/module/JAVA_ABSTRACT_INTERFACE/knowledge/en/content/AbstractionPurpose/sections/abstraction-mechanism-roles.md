| Design question | Abstract class | Interface |
| --- | --- | --- |
| Can it hold per-object state? | Yes | No independent instance state |
| Can it define constructors? | Yes | No |
| Can it provide implemented behavior? | Yes | Yes, through `default`, `static`, and `private` methods with different roles |
| How many can one class extend/implement? | One superclass | Multiple interfaces |
| Typical modeling role | closely related family with shared implementation | role/capability/contract |

This is only the orientation map. Later chapters explain the detailed rules and limits.
