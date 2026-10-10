Các overload không truyền executor của async factory/async continuation thường sử dụng default async facility của `CompletableFuture`, thông thường liên quan `ForkJoinPool.commonPool()`.

Không nên để blocking workload lớn vô tình chiếm common pool mà không hiểu tác động tới các feature khác trong process.

Custom executor hữu ích khi cần:

- resource isolation;
- queue/capacity riêng;
- thread naming;
- observability;
- shutdown policy;
- context propagation.
