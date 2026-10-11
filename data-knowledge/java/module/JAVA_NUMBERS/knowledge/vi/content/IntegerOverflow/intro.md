# Số nguyên độ rộng cố định và tràn số

Số nguyên kiểu nguyên thủy nhìn có vẻ “chính xác”, nhưng chỉ chính xác **trong phạm vi của kiểu có độ rộng cố định**. Khi phép toán vượt `MIN_VALUE` hoặc `MAX_VALUE`, Java không tự đổi sang `BigInteger` và cũng không mặc định ném ngoại lệ.
