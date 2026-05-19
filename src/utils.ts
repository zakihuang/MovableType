// 递归取值：支持 'a.b.c' 或 ['a', 'b', 'c'] 路径
export const getValueByPath = (obj: any, path: string | string[]): any => {
  const keys = Array.isArray(path) ? path : path.split('.')
  return keys.reduce((acc, key) => acc?.[key], obj)
}
