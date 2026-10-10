Hệ thống plugin thường muốn host gọi plugin qua một interface:

```java
package com.example.api;

public interface Plugin {
    String execute();
}
```

Implementation:

```java
package com.example.plugins;

import com.example.api.Plugin;

public final class PaymentPlugin implements Plugin {
    @Override
    public String execute() {
        return "payment";
    }
}
```

Thiết kế loader nên là:

```text
Application ClassLoader
→ defines com.example.api.Plugin
          ↑ parent
PluginClassLoader
→ delegates Plugin API to parent
→ defines PaymentPlugin itself
```

Khi đó:

```java
Class<?> implType =
        pluginLoader.loadClass("com.example.plugins.PaymentPlugin");

Plugin plugin =
        (Plugin) implType.getDeclaredConstructor().newInstance();

System.out.println(plugin.execute());
```

Cast hoạt động vì cả host và `PaymentPlugin` đều resolve `com.example.api.Plugin` về **cùng một `Plugin.class` do parent định nghĩa**.

Thiết kế lỗi thường là plugin đóng gói luôn cả API dùng chung và child-first loader tự định nghĩa nó:

```text
host Plugin
→ defined by app loader

plugin's Plugin
→ defined by plugin loader

same name
→ different identity
→ implementation không assignable sang host Plugin
```

Đây là quy tắc thiết kế quan trọng cho kiến trúc plugin:

> **Contract cần trao đổi qua ranh giới loader phải được chia sẻ từ một loader mà cả hai phía nhìn thấy tương thích.**

DTO, annotation, SPI interface hoặc exception type đi xuyên ranh giới này cũng cần suy nghĩ tương tự.

Class identity giải thích vì sao “có class rồi” vẫn chưa đủ cho framework discovery. Một thư viện ở parent đôi khi cần tìm implementation chỉ có child/application loader nhìn thấy. Chương tiếp theo giải thích cơ chế Thread Context ClassLoader dành cho tình huống đó.
