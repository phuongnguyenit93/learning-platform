HotSpot có thể dùng nhiều compilation level để cân bằng startup và peak performance. Ý tưởng tiered compilation là không bắt method phải đi thẳng từ interpreted sang “tối ưu tối đa”.

```text
interpreter
→ lightweight/fast compilation
→ richer profiling
→ highly optimized compilation
```

Policy cụ thể là implementation/version detail. Learner nên giữ mental model:

- cold code không đáng tốn nhiều compiler effort;
- warm/hot code có thể được nâng level;
- runtime profile feedback ảnh hưởng quyết định;
- code có thể được recompiled hoặc deoptimized.

Do đó hiệu năng của ứng dụng Java thường có **giai đoạn warm-up** thay vì ổn định ngay từ request đầu tiên.
