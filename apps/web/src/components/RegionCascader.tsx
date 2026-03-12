import React, { useState, useEffect } from 'react';
import { Cascader } from 'antd';
import { getRegions, getRegionsByParent, Region } from '@/services';

export interface RegionOption {
  value: string;
  label: string;
  code: string;
  isLeaf?: boolean;
  loading?: boolean;
  children?: RegionOption[];
}

export interface RegionValue {
  codes: string[];
  names: string[];
}

interface RegionCascaderProps {
  value?: RegionValue;
  onChange?: (value: RegionValue) => void;
  placeholder?: string;
}

export const RegionCascader: React.FC<RegionCascaderProps> = ({
  value,
  onChange,
  placeholder = '请选择省市区',
}) => {
  const [options, setOptions] = useState<RegionOption[]>([]);

  // 初始加载省级数据
  useEffect(() => {
    const init = async () => {
      try {
        const res = await getRegions();
        // 如果后端返回的是 AxiosResponse，使用 res.data
        // 这里假设 res.data 是 Region[] 或 ApiResponse 包裹的数据
        const provinces: RegionOption[] = (res.data as unknown as Region[]).map(
          (item) => ({
            value: item.code, // 使用 code 作为唯一 value，精确定位
            label: item.name,
            code: item.code,
            isLeaf: item.level === 3,
          }),
        );
        setOptions(provinces);
      } catch (e) {
        console.error('Fetch regions error', e);
      }
    };
    init();
  }, []);

  const loadData = async (selectedOptions: RegionOption[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    try {
      const res = await getRegionsByParent(targetOption.code);
      const data = res.data as unknown as Region[];
      targetOption.loading = false;
      targetOption.children = data.map((item) => ({
        value: item.code,
        label: item.name,
        code: item.code,
        isLeaf: item.level >= 3,
      }));
      setOptions([...options]);
    } catch {
      targetOption.loading = false;
    }
  };

  const handleChange = (
    val: (string | number)[] | string[][] | null,
    selectedOptions: RegionOption[] | RegionOption[][],
  ) => {
    if (onChange) {
      onChange({
        codes: (val as string[]) || [],
        names: selectedOptions
          ? (selectedOptions as RegionOption[]).map((o) => o.label)
          : [],
      });
    }
  };

  // 当有初始 value (且只有一维的 codes 数组，但 options 里还没对应节点) 时，需要展示文字
  // 我们利用 Cascader 的 displayRender 来自定义回显逻辑
  const displayRender = (labels: string[]) => {
    if (!labels || labels.length === 0) return '';

    // Ant Design Cascader 会尝试用找到的 options 的 label，如果没找到对应节点，
    // 它就会原样使用传入的 value (code) 作为 fallback。
    // 因此如果 labels 里面有纯数字（意味着没找到对应的中文 option），我们就应该用 value.names 强行覆盖回显。
    const hasUnresolvedCode = labels.some((label) => /^\d+$/.test(label));

    if (hasUnresolvedCode && value && value.names && value.names.length > 0) {
      return value.names.join(' / ');
    }

    return labels.join(' / ');
  };

  return (
    <Cascader
      options={options}
      loadData={loadData as unknown as undefined}
      onChange={handleChange as unknown as undefined}
      value={value?.codes}
      displayRender={displayRender}
      changeOnSelect={false}
      placeholder={placeholder}
    />
  );
};
