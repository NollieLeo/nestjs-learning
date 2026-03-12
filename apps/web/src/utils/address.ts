import type { AddressInfo } from '@nestjs-learning/shared';
import type { RegionValue } from '@/components/RegionCascader';

/**
 * 将后端的 AddressInfo 格式化为完整字符串（用于列表或详情展示）
 */
export const formatAddressInfo = (addr?: AddressInfo): string => {
  if (!addr) return '-';
  const fullAddress = [
    addr.provinceName,
    addr.cityName,
    addr.districtName,
    addr.detailAddress,
  ]
    .filter(Boolean)
    .join('');
  return fullAddress || '-';
};

/**
 * 将后端的 AddressInfo 提取为 RegionCascader 所需的 value 格式（用于表单回显）
 */
export const extractRegionValue = (
  addr?: AddressInfo,
): RegionValue | undefined => {
  if (!addr) return undefined;

  const codes = [addr.provinceCode, addr.cityCode, addr.districtCode].filter(
    (code): code is string => Boolean(code),
  );
  const names = [addr.provinceName, addr.cityName, addr.districtName].filter(
    (name): name is string => Boolean(name),
  );

  if (codes.length === 0) return undefined;

  return { codes, names };
};

/**
 * 将 RegionCascader 的 value 和 detailAddress 组合成后端的 AddressInfo Payload
 */
export const buildAddressInfoPayload = (
  region?: RegionValue,
  detailAddress?: string,
): AddressInfo => {
  const { codes, names } = region || {};
  return {
    provinceCode: codes?.[0] || '',
    provinceName: names?.[0] || '',
    cityCode: codes?.[1] || '',
    cityName: names?.[1] || '',
    districtCode: codes?.[2] || '',
    districtName: names?.[2] || '',
    detailAddress: detailAddress || '',
  };
};
