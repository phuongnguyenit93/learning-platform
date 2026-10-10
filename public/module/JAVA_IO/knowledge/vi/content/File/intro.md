# File và mô hình đường dẫn cũ

Luồng I/O trả lời câu hỏi “dữ liệu đi vào/ra như thế nào”. Trước khi mở luồng cho một tệp, chương trình còn cần nói tới vị trí, tên tệp, **thư mục (directory)** và **siêu dữ liệu (metadata)** — thông tin mô tả như tệp có tồn tại không, là tệp hay thư mục, kích thước bao nhiêu hoặc sửa lần cuối khi nào. `java.io.File` là API cũ của Java cho phần này.
