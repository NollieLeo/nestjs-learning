# TypeORM 高阶查询与防污染连表过滤指南

在复杂的业务场景（如分页查询、动态字段检索、关联数据的过滤等）中，简单的 `Repository.find()` 已经无法满足需求，这时候需要借助 `QueryBuilder` 进行高阶的 SQL 拼装。

本文档用来记录与沉淀我们处理 `User` 模块高级连表过滤等场景的最佳实践方案。

## 动态搜索与关键字泛型匹配

当接口提供一个万能的 `keyword` 搜索框时，我们通常希望：如果用户输入纯数字，同时将该字面量视为 `ID` 或者 `用户名`；如果输入字母，则仅当作 `模糊匹配用户名`。

```typescript
// 最佳实践：动态条件拼装
if (keyword) {
  const asNumber = Number(keyword);
  if (!isNaN(asNumber)) {
    // 🔥 数字：同时匹配精确的 ID 或 模糊匹配名称
    queryBuilder.where('(user.username LIKE :keyword OR user.id = :id)', {
      keyword: `%${keyword}%`,
      id: asNumber,
    });
  } else {
    // 🔤 字符串：回退到普通模糊查询
    queryBuilder.where('user.username LIKE :keyword', {
      keyword: `%${keyword}%`,
    });
  }
}
```

## 【重点】附加级联数据的无副作用过滤设计

### 痛点：使用 `.andWhere` 导致的关联数据丢失问题
当我们需要返回“带有角色的用户列表”，并且支持“仅查询特定角色 (`roleId`) 的用户”时，一种极具破坏性的错误写法是：

**❌ 副作用写法（会造成数据丢失）**
```typescript
queryBuilder
  .leftJoinAndSelect('user.roles', 'roles') // 【连表 1】：获取全量角色数组用于返回
  .andWhere('roles.id = :roleId', { roleId: role }); // 💥 致命错误：直接在 SELECT 层硬砍条件
```
**为什么错误**：因为 `.andWhere` 修改的是你 SELECT 出结果集的最终结构。假设用户 A 同时拥有 `Admin` 和 `Editor`，如果我们以上述代码根据 `Admin` (`roleId = 1`) 筛选：
- 用户 A 确实会被查出来。
- **但接口返回的用户 A 身上的 `roles` 数组里，将只剩下那个满足条件的 `Admin` 角色**，另一个 `Editor` 凭空报错被过滤掉了！

### 最佳实践：基于替身 `innerJoin` 的主表拦截器
为了保护 `leftJoinAndSelect` 查出来的完整关联数据不受污染，我们采用**分离式架构**：为主表新建一条隐藏的独立关联边只作过滤。

**✅ 官方推荐写法（隔离副作用）**
```typescript
const queryBuilder = this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.roles', 'roles'); // 第 1 步：保留全貌（仅获取不干扰）

if (role) {
  queryBuilder.innerJoin( // 第 2 步：创建单独用来拉扯主表记录下马的“无情锁喉”
    'user.roles',
    'roleFilter',         // 👈 核心：取一个不叫 'roles' 的替身假名，并且坚决不用 AndSelect
    'roleFilter.id = :roleId',
    { roleId: role },
  );
}
```

#### 工作原理
利用隐式创建的额外关联树：
1. `innerJoin` 特性要求：如果该用户身上没有匹配的任意 `roleFilter`，则该用户（主表数据）自己直接被排除。
2. 替身 `roleFilter`：由于取了新外号，且没有连带 `Select`，它完美实现了**“挥动滤网只筛走人”**却**不触及那些被留下来的人所带进来的附属数据结构**的业务要求。这保证了返回用户数据的一致性和完备性。
