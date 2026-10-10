### KHÁI NIỆM — các chế độ đang trả lời câu hỏi gì?

Khi bỏ bớt chữ số, Java phải quyết định kết quả sẽ đi về phía nào.

| Chế độ | Cách hiểu |
| --- | --- |
| `UP` | đi xa số 0 |
| `DOWN` | đi về số 0 |
| `CEILING` | đi về +∞ |
| `FLOOR` | đi về -∞ |
| `HALF_UP` | chọn giá trị gần nhất; nếu ở chính giữa → đi xa số 0 |
| `HALF_DOWN` | chọn giá trị gần nhất; nếu ở chính giữa → đi về số 0 |
| `HALF_EVEN` | chọn giá trị gần nhất; nếu ở chính giữa → chọn giá trị lân cận có chữ số cuối chẵn |
| `UNNECESSARY` | không cho phép làm tròn; nếu cần làm tròn thì báo lỗi |

Ở đây **tie** là thuật ngữ chỉ trường hợp giá trị chính xác nằm đúng giữa hai giá trị ứng viên sau khi làm tròn, ví dụ `2.5` khi làm tròn về số nguyên. Nếu không phải tie, các chế độ `HALF_*` đều chọn giá trị gần hơn.

### VÌ SAO cần phân biệt UP/DOWN với CEILING/FLOOR?

Với số dương chúng có thể nhìn giống nhau, nhưng với số âm thì khác:

```text
value = -2.1

UP      → -3   (xa số 0)
DOWN    → -2   (về số 0)
CEILING → -2   (về +∞)
FLOOR   → -3   (về -∞)
```

Đây là lý do không nên chọn chế độ làm tròn chỉ dựa vào tên nghe “hợp lý”; phải hiểu quy tắc về hướng làm tròn.

### Trường hợp ở chính giữa (tie)

Với một chữ số nguyên:

```text
 2.5

HALF_UP   → 3
HALF_DOWN → 2
HALF_EVEN → 2

 3.5

HALF_UP   → 4
HALF_DOWN → 3
HALF_EVEN → 4
```

`HALF_EVEN` giúp giảm độ lệch tích lũy trong một số khối lượng tính toán có nhiều trường hợp tie, nhưng không có nghĩa nó luôn đúng cho mọi bài toán.

Với số âm, các quy tắc tie tương tự vẫn áp dụng theo hướng của từng chế độ. Ví dụ `-2.5` với `HALF_UP` thành `-3`, còn `HALF_DOWN` và `HALF_EVEN` thành `-2`.
