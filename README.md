# 環境構築手順

このドキュメントでは、プロジェクトの環境構築と基本的な操作手順について説明します。

## 1. 環境の起動

Docker Composeを使用して環境を起動します：

```bash
docker-compose up -d
```

## 2. アプリケーションコンテナでの操作

### アプリコンテナへのアクセス

```bash
docker exec -it todo_api_clean-app-1 /bin/bash
```

### Prismaマイグレーションの実行

prismaディレクトリに移動してマイグレーションを実行します：

```bash
cd prisma
npx prisma migrate dev --name init
```

### 初期データの投入

シードスクリプトを実行してデータベースに初期データを格納します：

```bash
npx prisma db seed
```

### Prisma Studioの起動

Webブラウザベースのデータベース管理ツールを起動します：

```bash
npx prisma studio
```

## 3. データベースコンテナでの操作

### DBコンテナへのアクセス

```bash
docker exec -it todo_api_clean-db-1 /bin/bash
```

### PostgreSQLへの接続

Todo_dbデータベースに接続します：

```bash
psql -U postgres -d Todo_db
```

### 便利なPostgreSQLコマンド

テーブル一覧の表示：
```sql
\d
```

Todosテーブルの詳細表示：
```sql
\d "Todos"
```

Todosテーブルのデータ確認：
```sql
SELECT * FROM "Todos";
```

PostgreSQLを終了するには：
```sql
\q
```

## 4. APIテスト方法

プロジェクト内の`httpRequest`フォルダにある`.http`ファイルを使用してAPIテストを実行できます。

VS Codeを使用している場合は、[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)拡張機能をインストールすることで、エディタ内から直接APIリクエストを送信できます。

利用方法：
1. VS Codeで`.http`ファイルを開く
2. 各リクエスト定義の上部にある「Send Request」をクリックする
3. レスポンスが別タブで表示される

これにより、Postmanなどの外部ツールを使わずにAPIエンドポイントのテストが可能です。
