Phần này phải gắn với version vì implementation virtual thread thay đổi qua các JDK.

Trong **Java 2.**, virtual thread có thể bị pinned vào carrier trong một số trường hợp, đáng chú ý khi blocking trong lúc giữ monitor `synchronized`, hoặc qua một số native/foreign operation.

Pinning ngắn không đồng nghĩa correctness bug, nhưng blocking lâu/thường xuyên trong trạng thái pinned có thể làm giảm scalability vì carrier không được giải phóng.

Không nên biến rule này thành chân lý vĩnh viễn cho mọi JDK mới hơn; luôn kiểm tra behavior/version đang deploy.
