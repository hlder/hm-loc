# 鸿蒙依赖注入框架
## 使用
### 1.导入插件
#### 安装
```cmd
ohpm install @hld/loc
```

#### 将hvigor插件包复制到根目录/libs/loc_plugin-xxxx.tgz
#### 修改配置文件/hvigor/hvigor-config.json5
```json
{
  "modelVersion": "5.0.0",
  "dependencies": {
    "@app/loc-plugin": "file:../libs/loc_plugin-xxxx.tgz"
  }
}
```
#### 修改entry主项目的hvigorfile.ts文件,使用插件
```typescript
import { hapTasks } from '@ohos/hvigor-ohos-plugin';
import { locPlugin } from '@app/loc-plugin';

export default {
    system: hapTasks,
    plugins:[locPlugin()]
}
```
### 2.添加依赖(需要使用注入的模块中)
```
{
  ...
  "dependencies": {
    "@hld/loc": ">=1.0.0",
    ...
  }
}
```

### 3.添加注解
```typescript
// 可以定义接口，也可以不定义
export interface LibraryApi{
  // 定义方法
  getLibraryStr(): string
}

// @Inject("name") // 这边可以添加name，不加则默认为Loc.LibraryApi
@Inject()
export class LibraryApiImpl implements LibraryApi {
  getLibraryStr(): string {
    return "这是library1的内容"
  }
}
```
### 4.调用方创建LibraryApi对象
```typescript
 // 在@Inject如果没有添加name，则默认使用Loc.LibraryApi（需要注意name不能重复）
  libraryApi: LibraryApi = get<LibraryApi>(Loc.LibraryApi)
  // 调用方法
  libraryApi.getLibraryStr()
```

### 5.在ability的onCreate中初始化
```typescript
export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    EntryLocInit.init(); // EntryLocInit在执行sync后会自动生成，直接调用即可
  }
}
```
