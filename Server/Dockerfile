# 使用官方 Go 镜像作为构建环境
FROM golang:1.23 as builder

# 设置工作目录
WORKDIR /app

# 复制 go mod 和 sum 文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server

# 使用轻量级的 alpine 镜像
FROM alpine:latest  

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# 从构建器阶段复制二进制文件
COPY --from=builder /app/main .

# 暴露端口
EXPOSE 8080

# 运行
CMD ["./main"]