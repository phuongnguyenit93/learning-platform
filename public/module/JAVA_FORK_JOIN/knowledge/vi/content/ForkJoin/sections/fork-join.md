## 1. Tư tưởng cốt lõi: Chia nhỏ và Trị (Fork & Join)
Framework này được thiết kế để tận dụng tối đa các CPU nhiều nhân (Multi-core). Nó hoạt động theo hai bước chính:

* **Fork (Chia):** Nếu bài toán quá lớn, nó sẽ chia đôi bài toán đó thành các bài toán con (sub-tasks) và chạy chúng song song. Quá trình này lặp lại cho đến khi bài toán con đủ nhỏ để xử lý trực tiếp.
* **Join (Gộp):** Sau khi các bài toán con tính xong, kết quả sẽ được gộp lại dần dần để cho ra kết quả cuối cùng.

## 2. Đặc điểm "vô đối": Thuật toán Work-Stealing
Đây là lý do khiến Fork/Join cực nhanh. Trong một Thread Pool thông thường, nếu một Thread làm xong việc, nó sẽ đứng chơi. Trong **ForkJoinPool**:

1. Mỗi Thread có một hàng đợi (**deque**) các nhiệm vụ riêng.
2. Nếu Thread A làm xong hết việc của mình, nó sẽ nhìn sang hàng đợi của Thread B (vẫn đang ngập đầu trong việc).
3. Thread A sẽ **"trộm" (steal)** một nhiệm vụ từ cuối hàng đợi của Thread B để làm hộ.
4. Tránh Overkill:** Nếu bạn dùng `new Thread()` cho mỗi bản ghi, hệ thống sẽ sập (**Out of Memory**). Fork/Join giới hạn số luồng bằng đúng số nhân CPU, giúp máy chạy mượt mà ở mức tải tối đa.

**Kết quả:** Toàn bộ các nhân CPU luôn bận rộn 100%, không có nhân nào bị lãng phí.

## 3. Cấu trúc của Fork/Join
Để sử dụng, bạn cần làm quen với 3 thành phần chính:
* **ForkJoinPool:** "Nhà máy" quản lý các luồng. Thường dùng `ForkJoinPool.commonPool()`.
* **RecursiveTask<V>:** Dùng khi bài toán có trả về kết quả (ví dụ: tính tổng mảng).
* **RecursiveAction:** Dùng khi bài toán không trả về kết quả (ví dụ: sắp xếp mảng tại chỗ).

## 4. Ví dụ: Tính tổng một mảng 10 triệu phần tử

```java
	import java.util.concurrent.RecursiveTask;
	import java.util.concurrent.ForkJoinPool;

	public class SumTask extends RecursiveTask<Long> {
	    private static final int THRESHOLD = 1000; // Ngưỡng dừng chia nhỏ
	    private int[] array;
	    private int start;
	    private int end;

	    public SumTask(int[] array, int start, int end) {
	        this.array = array;
	        this.start = start;
	        this.end = end;
	    }

	    @Override
	    protected Long compute() {
	        if (end - start <= THRESHOLD) {
	            // Nếu đủ nhỏ, tính trực tiếp
	            long sum = 0;
	            for (int i = start; i < end; i++) sum += array[i];
	            return sum;
	        } else {
	            // Nếu còn lớn, chia đôi (Fork)
	            int mid = (start + end) / 2;
	            SumTask leftTask = new SumTask(array, start, mid);
	            SumTask rightTask = new SumTask(array, mid, end);

	            leftTask.fork(); // Chạy luồng con 1 song song
	            long rightResult = rightTask.compute(); // Chạy luồng con 2
	            long leftResult = leftTask.join(); // Đợi luồng con 1 và lấy kết quả

	            return leftResult + rightResult; // Gộp kết quả (Join)
	        }
	    }

	    public static void main(String[] args) {
	        int[] data = new int[10_000_000];
	        // ... fill data ...

	        ForkJoinPool pool = ForkJoinPool.commonPool();
	        long result = pool.invoke(new SumTask(data, 0, data.length));
	        System.out.println("Tổng là: " + result);
	    }
```

## 5. So sánh nhanh với ExecutorService

| Đặc điểm | ExecutorService | Fork/Join Framework |
| :--- | :--- | :--- |
| **Loại công việc** | Các task độc lập (Email, Request). | Task lớn có thể chia nhỏ (Recursive). |
| **Tận dụng CPU** | Bình thường. | Tối đa nhờ **Work-stealing**. |
| **Độ phức tạp** | Dễ dùng. | Khó hơn (phải thiết kế đệ quy). |

## 6. Những sai lầm chết người khi xử lý Record bằng Fork/Join

Trong dự án `java-learning` của bạn, hãy cực kỳ lưu ý 2 điểm sau để tránh "phản tác dụng":

### Không gọi Database trong compute()
Nếu 1 triệu bản ghi mà mỗi bản ghi bạn lại `SELECT * FROM...`, Fork/Join sẽ chậm hơn cả 1 luồng vì nó phải đợi phản hồi mạng (I/O).

> **Giải pháp:** Hãy lấy 1 triệu bản ghi về bộ nhớ trước, rồi mới dùng Fork/Join để xử lý logic (CPU-bound).

### Cẩn thận với việc gộp kết quả (Join)
Trong các ví dụ đơn giản, ta thường dùng `leftResult.addAll(rightResult)`. Tuy nhiên, với 1 triệu bản ghi, việc tạo ra quá nhiều `ArrayList` nhỏ rồi gộp lại liên tục sẽ gây áp lực cực lớn lên **Garbage Collection (GC)**.

> **Giải pháp:** Trong thực tế, người ta thường dùng một **Concurrent Collection** (như `ConcurrentLinkedQueue`) để các luồng đẩy kết quả trực tiếp vào đó, tránh việc tạo object trung gian không cần thiết.

## 💡 Lưu ý quan trọng
* **Chỉ dùng cho CPU-bound:** Đừng dùng Fork/Join cho các việc có I/O (đọc file, gọi database, gọi API).
* **Nguy cơ tê liệt:** Nếu bạn block luồng trong ForkJoinPool bằng I/O, cơ chế Work-stealing sẽ bị tê liệt hoàn toàn.

---
