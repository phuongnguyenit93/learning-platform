Các hệ thống có event liên tục, I/O bất đồng bộ hoặc producer/consumer chạy với tốc độ khác nhau cần một model biểu diễn data flow và timing rõ ràng.

Callback thủ công có thể giải quyết từng case nhưng khi flow dài, composition, error propagation và cancellation dễ trở nên rối.
