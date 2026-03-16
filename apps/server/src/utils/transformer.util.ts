import { TransformFnParams } from 'class-transformer';

/**
 * class-transformer 转换器：去除字符串前后空格
 * @example
 * \@Transform(trimString)
 * username: string;
 */
export const trimString = ({ value }: TransformFnParams): unknown => {
  return typeof value === 'string' ? value.trim() : value;
};
