Trước khi JNI_CreateJavaVM, native host mô tả cấu hình bằng JavaVMInitArgs. Cấu trúc này chứa version JNI mong muốn, danh sách option và cách xử lý option không được nhận diện.

~~~c
JavaVMOption options[1];
options[0].optionString = "-Dapp.mode=embedded";

JavaVMInitArgs args;
args.version = JNI_VERSION_21;
args.nOptions = 1;
args.options = options;
args.ignoreUnrecognized = JNI_FALSE;
~~~

JNI_GetDefaultJavaVMInitArgs có thể được dùng để kiểm tra/lấy cấu hình mặc định tương ứng với version được yêu cầu. Với JDK hiện đại, host thường xây JavaVMInitArgs trực tiếp nhưng vẫn phải đặt version hợp lệ.

VM option là một phần contract triển khai. Các option module như --add-opens hoặc --module-path khi truyền qua Invocation API cần dùng form option=value theo JNI Specification. Không nên copy command line option một cách máy móc mà bỏ qua syntax của JavaVMOption.
