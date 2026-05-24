# api-snapshot

[![CI](https://github.com/niuxinhuai/api-snapshot/actions/workflows/ci.yml/badge.svg)](https://github.com/niuxinhuai/api-snapshot/actions/workflows/ci.yml)

Capture API JSON responses and diff their field-level shape over time.

抓取接口 JSON 响应并对比字段结构变化，帮助前后端联调时发现破坏性变更。

## English

### Install

```bash
npm install -g api-snapshot
```

For local development:

```bash
npm install
npm link
api-snapshot --help
```

### Usage

Capture from a URL or JSON file, then compare snapshots by name.

```bash
api-snapshot capture users ./users.json
api-snapshot list
api-snapshot diff users users-v2
```

Try the included example:

```bash
api-snapshot capture users-v1 examples/users-v1.json
api-snapshot capture users-v2 examples/users-v2.json
api-snapshot diff users-v1 users-v2
```

### Status

This is an MVP designed to be useful immediately and easy to extend. It has no runtime dependencies and targets Node.js 18+.

### Test

```bash
npm test
```

## 中文

### 安装

```bash
npm install -g api-snapshot
```

本地开发：

```bash
npm install
npm link
api-snapshot --help
```

### 用法

可以从 URL 或本地 JSON 文件抓取快照，再按名称比较两个快照。

```bash
api-snapshot capture users ./users.json
api-snapshot list
api-snapshot diff users users-v2
```

试试内置示例：

```bash
api-snapshot capture users-v1 examples/users-v1.json
api-snapshot capture users-v2 examples/users-v2.json
api-snapshot diff users-v1 users-v2
```

### 当前状态

这是一个可以直接使用的 MVP，重点是小、清晰、容易二次开发。运行时无第三方依赖，要求 Node.js 18+。

### 测试

```bash
npm test
```

## License

MIT
