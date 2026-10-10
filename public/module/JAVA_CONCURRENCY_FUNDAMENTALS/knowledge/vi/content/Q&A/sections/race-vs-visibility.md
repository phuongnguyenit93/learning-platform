```text
Atomicity problem
→ operation bị interleave
→ lost update

Visibility problem
→ Thread không có guarantee thấy write của Thread khác

Ordering problem
→ cross-thread observation không có ordering guarantee phù hợp
```

Ba nhóm có thể xuất hiện cùng nhau, nhưng không nên trộn thành một khái niệm "CPU cache issue".
