HotSpot cũng có policy cho runtime compilation: code nào đủ “hot”, compilation level nào dùng, khi nào recompile/deopt và tài nguyên compiler được phân bổ ra sao.

Tiered compilation thường là default trong modern HotSpot vì cân bằng startup/profiling/peak performance.

Ứng dụng thường không cần điều khiển compiler thresholds bằng flag ngay từ đầu. Các flag này rất nhạy với implementation và có thể làm benchmark/hành vi ứng dụng khác xa production nếu dùng thiếu bằng chứng.

Tuning compiler chỉ nên xảy ra khi profiling cho thấy compilation/warm-up/code-cache thực sự là bottleneck phù hợp.
