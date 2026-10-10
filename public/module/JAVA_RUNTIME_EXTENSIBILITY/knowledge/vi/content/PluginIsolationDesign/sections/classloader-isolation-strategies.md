Ở mức architecture có vài chiến lược loader phổ biến:

```text
single loader
→ đơn giản, ít isolation

parent-first plugin loader
→ ưu tiên shared/host classes từ parent

child-first plugin loader
→ plugin ưu tiên private version, cần careful package exclusions

one loader per plugin
→ isolation mạnh hơn, lifecycle/unload tracking rõ hơn
```

Không có chiến lược “tốt nhất” cho mọi plugin system.

Parent-first giúp contract identity ổn định nhưng plugin có thể bị ép dùng dependency version của host. Child-first cho phép private dependency version nhưng dễ duplicate contract/JDK-adjacent type nếu policy package không rõ.

ModuleLayer cung cấp one-loader/many-loader mapping cho named modules; custom mapping còn linh hoạt hơn nhưng tăng trách nhiệm về readability và class loading.

Thiết kế loader phải bắt đầu từ isolation requirement, không bắt đầu từ “hãy dùng child-first vì plugin framework thường làm vậy”.
