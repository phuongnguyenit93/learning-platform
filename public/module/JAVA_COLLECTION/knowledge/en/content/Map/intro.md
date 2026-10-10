# Core Collection Contracts — Map

The **Core Collection Contracts** milestone next reaches a requirement that does not fit `Collection<E>` well: finding a value through a **separate key**. An application may own many `Order` objects while incoming requests identify them by `orderId`. `Map<K, V>` models that relationship directly.
