# 会員専用アプリ

新潟県長岡市で活動している吹奏楽団体である[ザ・ウィンド・アンサンブル](https://winds-n.com)の会員のためのアプリです。  
ザ・ウィンド・アンサンブル向けに最適化されています。

<img src="https://user-images.githubusercontent.com/25874594/66272455-d4900680-e8a4-11e9-9d0e-e134f46e7104.png" width="320px" />

# ディレクトリ構成

- `/client/build` 公開されるデータ
- `/client/src` クライアントアプリのソースコード
- `/server` Webサーバで使用するライブラリ
- `/app.js` Webサーバ

# 使い方

## 準備

npmがインストールされている環境でClone後、以下を実行してください。

```
# cd member
# npm i
```

## アプリのビルドと実行

クライアントアプリをビルドし、Webサーバを起動してください。

### 開発コマンド

```
# npm run build-dev
```

### 本番ビルド

```
# npm run build-prod
```

### Webサーバ

```
node app.js
```

Expressサーバが起動します。  
使用ポートは3006番です。(127.0.0.1:3006)

外部からアクセスする場合はApacheなどでプロキシを通してください。

# 使用するAPI

以下のAPIを使用します。

### ユーザ認証

`auth.winds-n.com`を参照

### 演奏会データ

`app.winds-n.com`を参照

### 各種API

`api.winds-n.com`を参照

### ウィンズスコア

`score.winds-n.com`を参照
