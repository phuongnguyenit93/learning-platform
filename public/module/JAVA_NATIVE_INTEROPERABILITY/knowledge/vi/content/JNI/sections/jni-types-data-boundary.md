JNI định nghĩa type riêng để biểu diễn dữ liệu đi qua boundary. Primitive Java tương ứng với các type như jboolean, jint, jlong, jfloat; object/reference được biểu diễn qua jobject và các subtype như jstring, jclass, jarray.

Không nên cast tùy tiện giữa Java-facing data và C type chỉ vì kích thước “có vẻ giống nhau”. JNI type contract mới là nguồn đúng.

String và array cần chú ý hơn primitive:

- các API như GetStringUTFChars làm việc với Modified UTF-8 theo JNI contract và phải đi cùng ReleaseStringUTFChars;
- GetPrimitiveArrayElements có thể trả direct pointer hoặc một bản sao tùy phần triển khai; code phải gọi Release... theo contract;
- Get/Set...ArrayRegion phù hợp khi chỉ cần copy một vùng dữ liệu.

Một cách làm an toàn là giữ thời gian “mượn” pointer native ngắn nhất có thể, không lưu pointer qua lifetime không được bảo đảm và luôn ghép cặp thao tác acquire/release.
