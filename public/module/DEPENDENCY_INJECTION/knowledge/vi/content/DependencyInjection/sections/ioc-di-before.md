Một object hoàn toàn có thể tự tạo dependency nếu dependency nhỏ, ổn định và thực sự là implementation detail.

DI trở nên hữu ích khi dependency là collaborator có contract riêng, lifecycle riêng hoặc cần thay thế theo environment/test.
