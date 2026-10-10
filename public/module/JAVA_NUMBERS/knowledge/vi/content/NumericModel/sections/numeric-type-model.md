### KHÁI NIỆM — Java có những cách biểu diễn số nào?

Các kiểu số nguyên thủy:

| Kiểu | Số bit | Giá trị nhỏ nhất | Giá trị lớn nhất |
| --- | ---: | ---: | ---: |
| `byte` | 8 | -128 | 127 |
| `short` | 16 | -32,768 | 32,767 |
| `int` | 32 | -2³¹ | 2³¹ - 1 |
| `long` | 64 | -2⁶³ | 2⁶³ - 1 |

`char` cũng là kiểu nguyên thủy dạng số nguyên nhưng dùng để biểu diễn một đơn vị mã UTF-16 (code unit); trong phạm vi học Numbers, trọng tâm phép toán số học thường nằm ở `byte/short/int/long`.

Các kiểu nguyên thủy dấu phẩy động:

```text
float   → IEEE 754 binary32
double  → IEEE 754 binary64
```

Các kiểu đối tượng quan trọng:

```text
BigInteger
→ số nguyên có độ chính xác tùy ý (arbitrary precision)

BigDecimal
→ số nguyên chưa áp dụng scale (unscaled integer) có độ chính xác tùy ý + scale kiểu int
→ ngữ nghĩa thập phân và chính sách làm tròn rõ ràng
```

### VÌ SAO — Vì sao cần nhiều kiểu?

Hãy bắt đầu từ yêu cầu của bài toán thay vì từ cú pháp Java:

| Bài toán | Cách biểu diễn thường phù hợp | Lý do chính |
| --- | --- | --- |
| số lượng, chỉ số, bộ đếm nhỏ | `int` | nhanh, đơn giản, đủ phạm vi |
| mốc thời gian/số đếm lớn | `long` | phạm vi lớn hơn |
| khoa học/cảm biến/đồ họa | `double` | phạm vi rộng + được phần cứng hỗ trợ |
| số nguyên vượt `long` | `BigInteger` | không bị giới hạn bởi độ rộng cố định |
| tiền, thuế, tỷ lệ thập phân | `BigDecimal` | ngữ nghĩa thập phân + cách làm tròn tường minh |

Một ID trong cơ sở dữ liệu thường nên là `long` không phải vì cần làm toán, mà vì cần **phạm vi đủ rộng**. Một số đo nhiệt độ có thể dùng `double` vì bài toán chấp nhận một mức sai số. Một số tiền lại thường không nên dùng `double` vì yêu cầu cần ngữ nghĩa thập phân rõ ràng.

### CÁCH CHỌN — Chọn cách biểu diễn theo yêu cầu bài toán

Khi gặp một giá trị số, hỏi theo thứ tự:

```text
1. Có cần phần thập phân không?
        ↓
2. Có cần giá trị thập phân chính xác không?
        ↓
3. Phạm vi tối đa là bao nhiêu?
        ↓
4. Có cho phép tràn số/làm tròn không?
        ↓
5. Hiệu năng/mức dùng bộ nhớ có quan trọng không?
```

Không nên chọn `double` chỉ vì “chứa được số lớn”, cũng không nên dùng `BigDecimal` cho mọi phép toán chỉ vì “chính xác hơn”. Mỗi cách biểu diễn giải quyết một nhóm yêu cầu khác nhau.
