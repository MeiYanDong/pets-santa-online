# Pets Santa Online

一个基于 AI 的宠物圣诞照片生成应用。用户可以上传宠物照片，通过 AI 技术将其转换为各种节日风格的圣诞主题图片。

## 功能特性

- **AI 图片生成** - 使用 AI 技术将宠物照片转换为圣诞主题风格
- **多种风格模板** - 提供圣诞老人装、精灵装、驯鹿帽衫、温暖毛衣等 6 种节日风格
- **用户认证** - 支持邮箱密码登录和 Google OAuth 登录
- **积分系统** - 基于积分的使用模式，每次生成消耗 20 积分
- **在线支付** - 集成 Stripe 支付，支持一次性购买积分包
- **作品管理** - 用户可查看历史生成记录并下载图片
- **深色模式** - 支持明暗主题切换

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 + React 19 |
| 样式 | Tailwind CSS 4 |
| 数据库 | Supabase PostgreSQL + Drizzle ORM |
| 认证 | Better Auth |
| 支付 | Stripe |
| 存储 | Vercel Blob |
| AI | Tu-zi API |

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或
bun install
```

### 2. 配置环境变量

复制 `env.example` 为 `.env` 并填写配置：

```bash
cp env.example .env
```

需要配置以下环境变量：

```env
# 数据库
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# 认证
BETTER_AUTH_SECRET=your_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Stripe 支付
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
PRICE_ID=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Vercel Blob 存储
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx

# AI 图片生成
TUZI_API_KEY=sk-xxx
```

### 3. 初始化数据库

```bash
# 生成数据库迁移
npm run db:generate

# 执行迁移
npm run db:migrate

# (可选) 打开数据库可视化工具
npm run db:studio
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # 页面路由
│   │   ├── (auth)/        # 登录/注册页面
│   │   ├── (home)/        # 首页
│   │   └── billing/       # 支付页面
│   └── api/               # API 路由
│       ├── generate/      # 图片生成
│       ├── upload/        # 图片上传
│       ├── checkout/      # Stripe 结账
│       ├── billing/       # 积分查询
│       ├── creations/     # 作品列表
│       └── webhook/       # Stripe 回调
├── components/            # React 组件
│   ├── pets-santa/        # 业务组件
│   └── ui/                # UI 组件库
├── db/schema/             # 数据库表结构
├── lib/                   # 工具库
├── services/              # 业务服务
├── constants/             # 常量定义
└── types/                 # TypeScript 类型
```

## 可用脚本

```bash
npm run dev        # 启动开发服务器
npm run build      # 构建生产版本
npm run start      # 启动生产服务器
npm run lint       # 代码检查
npm run db:generate # 生成数据库迁移
npm run db:migrate  # 执行数据库迁移
npm run db:studio   # 打开 Drizzle Studio
```

## 生成流程

1. 用户上传宠物照片（存储到 Vercel Blob）
2. 选择节日风格模板
3. 系统检查并预扣除积分（20 积分/次）
4. 调用 AI 接口生成图片
5. 生成结果存储到 Vercel Blob
6. 生成失败时自动退还积分

## License

MIT
