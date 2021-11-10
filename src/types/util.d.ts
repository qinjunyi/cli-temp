declare namespace Util {
  // 对象键值
  type ValueOf<T> = T[keyof T];
}
