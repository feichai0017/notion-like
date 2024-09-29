# 使用 Node.js 作为构建环境
FROM node:22.7 as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# 生产阶段
FROM node:20.8-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public  # 没有 public 文件夹
COPY --from=builder /app/next.config.mjs ./
RUN npm install --only=production
EXPOSE 3000
CMD ["npm", "start"]

# # 使用 Nginx 来服务静态文件
# FROM nginx:alpine

# COPY --from=builder /app/build /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]