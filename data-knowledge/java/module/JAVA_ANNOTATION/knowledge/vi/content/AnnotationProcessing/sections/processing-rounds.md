Xử lý Annotation không phải “quét Annotation một lần rồi gọi processor một lần”.

Mô hình đúng:

```text
vòng 1
→ các phần tử gốc ban đầu
→ processor có thể sinh mã nguồn/class file

vòng 2
→ mã nguồn/class file được sinh trở thành đầu vào mới
→ processor chạy tiếp

...

vòng cuối
→ không còn mã nguồn mới cần xử lý
→ processingOver() = true
```

Ví dụ processor sinh:

```text
Order
→ OrderMapperGenerated
→ type được sinh lại có Annotation khác
→ processor phù hợp có thể thấy Annotation đó ở vòng sau
```

`RoundEnvironment.processingOver()` cho biết đã đến vòng cuối. `errorRaised()` cho biết vòng trước đã phát sinh lỗi.

Processor đã được gọi ở một vòng sẽ tiếp tục được công cụ gọi ở các vòng sau, kể cả vòng cuối, và tập Annotation truyền vào có thể rỗng.

Vì vậy processor phải được thiết kế **an toàn khi chạy qua nhiều vòng**.
