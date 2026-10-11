`allOf(...)` hoàn thành khi tất cả future đầu vào hoàn thành.

`allOf(...)` trả `CompletableFuture<Void>`; nếu cần result typed của từng future, application vẫn phải giữ reference và lấy result của từng stage sau khi barrier completion hoàn tất.

"Hoàn thành" ở đây không đồng nghĩa "thành công". Nếu một input future complete exceptionally, aggregate future của `allOf(...)` cũng complete exceptionally sau khi các input cần thiết đã hoàn tất theo contract.

Điểm dễ nhầm là `allOf()` **không phải fail-fast barrier** theo nghĩa "một child fail là aggregate lập tức hoàn tất". Ví dụ:

```text
A fail trước
B vẫn chưa complete

allOf(A, B)
→ aggregate vẫn chưa complete

B complete sau
→ lúc này aggregate complete exceptionally
```

Nếu business cần fail-fast orchestration và chủ động cancel work còn lại, application phải xây policy riêng thay vì suy ra từ `allOf()`.

`anyOf(...)` hoàn thành khi **một future đầu tiên** hoàn thành.

First completion có thể là success **hoặc failure**. Nếu future đầu tiên complete exceptionally thì aggregate `anyOf(...)` cũng có thể complete exceptionally ngay; nó không bỏ qua failure để chờ một future khác success.

Điều đó có nghĩa:

```text
anyOf = fastest completion
```

không phải:

```text
anyOf = best business result
```

Ví dụ hai server trả giá:

```text
Server A hoàn thành trước: 200 USD
Server B hoàn thành sau: 190 USD
```

`anyOf` có thể trả 200 USD vì A nhanh hơn; nó không tự biết 190 USD là "giá tốt hơn".

Failure race cũng tương tự:

```text
Server A fail trước
Server B success sau

anyOf(A, B)
→ first completion là failure
→ aggregate có thể complete exceptionally
```

Ngoài ra `allOf()` / `anyOf()` là **completion aggregation**, không phải cancellation policy. Không nên mặc định rằng aggregate complete/fail thì các sibling future còn lại sẽ tự bị cancel. Nếu business cần winner-cancels-losers hoặc fail-fast kèm cancellation, application phải thiết kế cancellation/cleanup riêng.

Tham khảo:

```text
AsyncController#fastest()
GET /async/fastest

AsyncController#allOf()
GET /async/all-of
```

Experiment điều khiển thứ tự completion bằng coordination signal thay vì dựa vào `sleep()` timing. Server A được phép hoàn thành trước, sau khi `anyOf` chọn winner thì Server B mới được release và cleanup trước khi experiment kết thúc.

Experiment còn tạo một race nhỏ không cần timing: một future được complete exceptionally trước, future còn lại success sau. Response xác nhận exceptional completion có thể thắng `anyOf` và losing future không bị cancel tự động.

`allOf()` còn chạy một case có controlled completion order: input A fail trước khi sibling B complete. Response xác nhận aggregate chưa complete ngay sau failure đầu tiên, chỉ complete sau khi sibling còn lại hoàn tất, rồi expose exceptional completion mà không tự cancel sibling:

```text
aggregateCompletedImmediatelyAfterFirstFailure = false
aggregateWaitedForRemainingSibling = true
aggregateExceptionalWhenInputFails = true
successfulSiblingCancelledAutomatically = false
```

**Kết luận:** primitive coordination không thay thế business selection rule.
