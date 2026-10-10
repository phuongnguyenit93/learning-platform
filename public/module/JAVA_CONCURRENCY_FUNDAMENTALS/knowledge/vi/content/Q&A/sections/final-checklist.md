1. State nào thực sự được share?
2. State đó có mutable không?
3. Correctness cần atomicity, visibility hay ordering guarantee nào?
4. Object/reference được publish sang Thread khác bằng boundary nào? Có `this` escape quá sớm không?
5. Có thể tránh sharing bằng immutability/message passing không?
6. Nếu dùng lock, lock owner/scope/order là gì?
7. Nếu Thread phải chờ, primitive coordination nào phù hợp?
8. Executor có bounded capacity không?
9. Overload/rejection strategy là gì?
10. Task có cancellation/timeout không?
11. Ai sở hữu lifecycle và shutdown resource?
12. ThreadLocal/context có cleanup không?
13. Demo/benchmark có thực sự chứng minh điều mình kết luận không?
