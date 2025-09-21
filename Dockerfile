# syntax=docker/dockerfile:1
FROM node:20-slim

WORKDIR /app

# package.json と lock ファイルを先にコピーしてキャッシュ活用
COPY package.json package-lock.json* yarn.lock* ./

# 依存関係をインストール
RUN if [ -f "yarn.lock" ]; then yarn install; \
    elif [ -f "package-lock.json" ]; then npm install; \
    else echo "Lockfile not found." && exit 1; fi

# アプリケーションコードをコピー
COPY . .

# 開発サーバー起動
CMD ["npm", "run", "dev"]
