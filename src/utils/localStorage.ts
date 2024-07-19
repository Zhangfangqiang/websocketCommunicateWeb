const ls = localStorage

export default {
  /**
   * 设置
   */
  setItem(name:string, value:string) {
    if (typeof value == 'object') {
      ls.setItem(name, JSON.stringify(value))
    } else {
      ls.setItem(name, value)
    }
  },

  /**
   * 获取
   */
  getItem(name:string) {
    try {
      return JSON.parse(ls.getItem(name) as string)
    } catch (e) {
      return null
    }
  },

  /**
   * 移除
   */
  removeItem(name:string) {
    ls.removeItem(name)
  }
}
