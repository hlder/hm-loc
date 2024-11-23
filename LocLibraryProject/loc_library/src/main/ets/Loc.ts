import HashMap from '@ohos.util.HashMap'
import { LocProvider } from './LocProvider'

export const Loc: any = {}

const LocProviderMap: HashMap<string, LocProvider> = new HashMap()

// Loc初始化，调用addProvider添加注入方法
export class LocInit {
  static addProvider(key: string, provider: LocProvider) {
    LocProviderMap.set(key, provider)
  }
}

// get方法获取provider并调用自动创建对象。
export function get<T>(key: string): T {
  return LocProviderMap.get(key)?.() as T
}