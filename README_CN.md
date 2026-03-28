# Socker Studio - 北欧风格电商应用

一个现代化的全栈电商应用，采用北欧极简设计风格，基于 React + TypeScript + Vite + Node.js + Fastify 构建。

> 📖 其他语言: [English](./README.md)

## ✨ 项目特色

- 🎨 **北欧极简设计** - 清爽、优雅的用户界面
- ⚡ **极致性能** - Vite 构建，瞬间热更新
- 🔐 **完整认证** - Firebase + JWT 双认证系统
- 🛒 **购物流程** - 从浏览到下单的完整体验
- 📱 **响应式设计** - 完美适配移动端和桌面端
- ✅ **测试覆盖** - 99个测试用例，100%通过率
- 🗄️ **全栈架构** - 前端 + 后端 + 数据库完整解决方案

## 🚀 核心功能

### 用户系统
- ✅ 用户注册/登录（邮箱、Google、GitHub）
- ✅ 个人资料管理
- ✅ 收货地址管理
- ✅ 订单历史查看

### 商品系统
- ✅ 商品列表展示
- ✅ 多维度筛选（价格、评分、分类）
- ✅ 搜索功能（历史记录、热门推荐）
- ✅ 商品详情页
- ✅ 商品评价系统

### 购物系统
- ✅ 购物车管理
- ✅ 收藏功能
- ✅ 结账流程
- ✅ 订单跟踪

### 界面体验
- ✅ Toast 通知系统
- ✅ 加载状态管理
- ✅ 错误处理
- ✅ 平滑动画过渡

## 🛠️ 技术栈

### 前端
- **框架**: React 19 + TypeScript
- **构建**: Vite 6
- **样式**: Tailwind CSS 4
- **状态**: Zustand
- **路由**: React Router 7
- **认证**: Firebase Auth + JWT
- **图标**: Lucide React

### 后端
- **运行时**: Node.js + Fastify
- **语言**: TypeScript
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: JWT + bcrypt
- **验证**: Zod
- **API**: RESTful API

### 测试
- **框架**: Vitest
- **组件测试**: @testing-library/react
- **用户交互**: @testing-library/user-event

### 开发工具
- **包管理**: pnpm
- **代码规范**: ESLint
- **类型检查**: TypeScript

## 📁 项目结构

```
├── src/                    # 前端源代码
│   ├── components/         # 通用组件
│   │   ├── ui/            # UI 基础组件
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── toast.tsx
│   │   └── Login.tsx      # 登录组件
│   ├── pages/             # 页面组件
│   │   ├── Home.tsx       # 首页
│   │   ├── ProductDetail.tsx # 商品详情
│   │   ├── Cart.tsx       # 购物车
│   │   ├── Checkout.tsx   # 结账
│   │   ├── Profile.tsx    # 个人中心
│   │   ├── Favorites.tsx  # 收藏
│   │   └── OrderTracking.tsx # 订单跟踪
│   ├── store/             # 状态管理
│   │   ├── authStore.ts   # 认证状态
│   │   ├── cartStore.ts   # 购物车状态
│   │   ├── favoritesStore.ts # 收藏状态
│   │   ├── filterStore.ts # 筛选状态
│   │   └── reviewStore.ts # 评价状态
│   ├── lib/               # 工具库
│   │   ├── firebase.ts    # Firebase 配置
│   │   ├── api.ts         # API 客户端
│   │   └── utils.ts       # 工具函数
│   ├── data/              # 数据
│   │   └── products.ts    # 商品数据
│   └── test/              # 测试配置
│       └── setup.ts
├── backend/               # 后端源代码
│   ├── src/
│   │   ├── routes/        # API 路由
│   │   │   ├── auth.ts    # 认证
│   │   │   ├── products.ts # 商品
│   │   │   ├── orders.ts  # 订单
│   │   │   ├── users.ts   # 用户
│   │   │   ├── cart.ts    # 购物车
│   │   │   └── favorites.ts # 收藏
│   │   ├── utils/         # 工具函数
│   │   │   └── prisma.ts  # Prisma 客户端
│   │   ├── schemas/       # 验证模式
│   │   ├── seed.ts        # 数据库种子
│   │   └── index.ts       # 入口文件
│   └── prisma/
│       └── schema.prisma  # 数据库模式
```

## 🚦 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 16+
- pnpm（推荐）

### 安装依赖
```bash
# 安装前端依赖
pnpm install

# 安装后端依赖
cd backend && pnpm install
```

### 配置环境变量
```bash
# 前端
cp .env.example .env
# 编辑 .env 文件，填入你的 Firebase 配置

# 后端
cd backend && cp .env.example .env
# 编辑 .env 文件，填入你的数据库配置
```

### 数据库设置
```bash
cd backend

# 运行数据库迁移
npx prisma migrate dev

# 填充种子数据
pnpm prisma:seed
```

### 启动开发服务器
```bash
# 启动后端（在 backend 目录）
pnpm dev

# 启动前端（在根目录）
pnpm dev
```

- 前端: http://localhost:5173
- 后端 API: http://localhost:3001

### 构建生产版本
```bash
pnpm build
```

### 运行测试
```bash
# 运行测试（watch 模式）
pnpm test

# 运行测试（单次）
pnpm test:run

# 查看测试覆盖率
pnpm test:coverage
```

## 📊 测试覆盖

项目包含 **99 个测试用例**，覆盖所有核心功能：

```
✓ src/store/filterStore.test.ts (20 tests)
✓ src/lib/utils.test.ts (4 tests)
✓ src/store/reviewStore.test.ts (15 tests)
✓ src/store/favoritesStore.test.ts (12 tests)
✓ src/components/ui/button.test.tsx (6 tests)
✓ src/components/ui/input.test.tsx (21 tests)
✓ src/store/cartStore.test.ts (11 tests)
✓ src/store/authStore.test.ts (10 tests)

Test Files  8 passed (8)
Tests  99 passed (99)
```

## 🎯 未来规划

### 前端增强
- [ ] 性能优化（代码分割、懒加载）
- [ ] PWA 支持（离线访问、推送通知）
- [ ] 国际化（多语言支持）
- [ ] 无障碍访问优化
- [ ] 骨架屏加载动画
- [ ] 商品对比功能
- [ ] 优惠券系统

### 全栈转型
- [x] 后端 API 开发（Node.js + Fastify）✅
- [x] 数据库设计（PostgreSQL + Prisma）✅
- [ ] 支付集成（Stripe）
- [ ] 邮件服务（SendGrid）
- [ ] 文件存储（AWS S3/Cloudinary）
- [ ] 后台管理系统
- [ ] 部署与运维（Vercel + Railway）

### 高级功能
- [ ] 智能推荐算法
- [ ] 实时库存更新
- [ ] 价格变动通知
- [ ] 社交分享
- [ ] 评论图片上传

## 📝 开发日志

### 2026-03-28
- ✅ 完成 Phase 4 后端 API 开发
- ✅ 搭建 Node.js + Fastify 后端架构
- ✅ 实现 PostgreSQL 数据库与 Prisma ORM
- ✅ 创建完整的 RESTful API（认证、商品、订单、购物车、收藏）
- ✅ 添加数据库种子数据（12个商品、2个用户、评价）
- ✅ 完成前后端集成

### 2026-03-27
- ✅ 完成核心电商功能开发
- ✅ 实现完整的测试覆盖（99个测试）
- ✅ 添加订单跟踪功能
- ✅ 优化筛选和搜索功能
- ✅ 完善用户认证流程

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [项目演示](#)
- [API 文档](#)
- [设计规范](#)

---

**Socker Studio** - 让购物体验更优雅 🛍️