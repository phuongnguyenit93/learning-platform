Mỗi JVM thread có một `pc` (program counter) register riêng. Khi thread đang thực thi non-native method, `pc` biểu diễn địa chỉ/instruction position của JVM instruction hiện tại theo model của implementation.

Nó tồn tại vì JVM cần biết thread đang ở đâu trong instruction stream để tiếp tục execution sau branching, method dispatch hoặc scheduling.

Đối với native method, giá trị `pc` không được specification định nghĩa theo cùng cách.

Learner không cần thao tác trực tiếp với `pc`; mục đích của section là hoàn thiện mental model rằng execution state không chỉ gồm stack và heap.
