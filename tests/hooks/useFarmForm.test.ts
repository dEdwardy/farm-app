import { useFarmForm } from '@/hooks/useFarmForm';
import { dataService } from '@/services/dataService';
import { act, renderHook } from '@testing-library/react-native';

// 模拟 dataService
jest.mock('@/services/dataService', () => ({
  dataService: {
    addFarm: jest.fn().mockResolvedValue(true),
    updateFarm: jest.fn().mockResolvedValue(true),
  },
}));

// 模拟 toast
jest.mock('@/utils/toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// 模拟 logger
jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('useFarmForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default form data', () => {
    const { result } = renderHook(() => useFarmForm());
    expect(result.current.formData).toEqual({
      farm_name: '',
      address: undefined,
      longitude_latitude: undefined,
      responsible_person: undefined,
      contact_phone: undefined,
      pond_count: undefined,
      water_area_acre: undefined,
      farm_area_acre: undefined,
      other_water_area_sqm: undefined,
      other_farm_area_acre: undefined,
      avg_water_depth: undefined,
      main_species: undefined,
      farm_mode: undefined,
      operation_status: undefined,
      output: undefined,
      output_value: undefined,
      total_investment: undefined,
      farm_images: [],
      has_treatment_facility: false,
      treatment_method: undefined,
      treatment_facility_area: undefined,
      treated_discharge_volume: undefined,
      final_destination: undefined,
      tail_water_images: [],
      safety_info: [],
    });
  });

  test('should initialize with provided initial data', () => {
    const initialData = {
      farm_name: 'Initial Farm',
      address: 'Initial Address',
      has_treatment_facility: true,
    };
    const { result } = renderHook(() => useFarmForm({ initialData }));
    expect(result.current.formData.farm_name).toBe('Initial Farm');
    expect(result.current.formData.address).toBe('Initial Address');
    expect(result.current.formData.has_treatment_facility).toBe(true);
  });

  test('should update form data when handleChange is called', () => {
    const { result } = renderHook(() => useFarmForm());

    act(() => {
      result.current.handleChange('farm_name', 'Test Farm');
    });

    // 验证表单数据是否已更新
    expect(result.current.formData.farm_name).toBe('Test Farm');
  });

  test('should handle boolean field changes correctly', () => {
    const { result } = renderHook(() => useFarmForm());

    act(() => {
      result.current.handleChange('has_treatment_facility', true);
    });

    expect(result.current.formData.has_treatment_facility).toBe(true);
  });

  test('should handle image changes correctly', () => {
    const { result } = renderHook(() => useFarmForm());
    const testFiles = [{ url: 'test.jpg', name: 'test.jpg', size: 1024 }];

    act(() => {
      result.current.handleImagesChange('farm_images', testFiles);
    });

    expect(result.current.formData.farm_images).toEqual(testFiles);
  });

  test('should remove images correctly', () => {
    const initialData = {
      farm_images: [
        { url: 'image1.jpg', name: 'image1.jpg', size: 1024 },
        { url: 'image2.jpg', name: 'image2.jpg', size: 2048 },
      ],
    };
    const { result } = renderHook(() => useFarmForm({ initialData }));

    act(() => {
      result.current.handleImageRemove('farm_images', 0);
    });

    const farmImages = result.current.formData.farm_images || [];
    expect(farmImages).toHaveLength(1);
    expect(farmImages[0]?.name).toBe('image2.jpg');
  });

  test('should validate form data correctly', async () => {
    const { result } = renderHook(() => useFarmForm());

    // 验证表单验证失败（缺少必填项）
    let validateResult;
    await act(async () => {
      validateResult = await result.current.validate();
    });

    expect(validateResult).toBe(false);
    expect(Object.keys(result.current.errors)).toHaveLength(1); // farm_name 是必填项
  });

  test('should pass validation with required fields filled', async () => {
    const { result } = renderHook(() => useFarmForm());

    act(() => {
      result.current.handleChange('farm_name', 'Test Farm');
    });

    let validateResult;
    await act(async () => {
      validateResult = await result.current.validate();
    });

    expect(validateResult).toBe(true);
    expect(Object.keys(result.current.errors)).toHaveLength(0);
  });

  test('should submit form data successfully', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useFarmForm({ onSuccess }));

    // 填充必要的表单数据并立即提交
    let submitResult: Promise<boolean> | undefined;
    act(() => {
      result.current.handleChange('farm_name', 'Test Farm');
      submitResult = result.current.submit();
    });

    // 等待提交完成，将异步操作也包裹在act()中
    if (submitResult) {
      await act(async () => {
        const resultValue = await submitResult;
        expect(resultValue).toBe(true);
      });
    }

    expect(dataService.addFarm).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  test('should handle form submission with id (update)', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useFarmForm({ onSuccess }));

    // 填充必要的表单数据并立即提交（更新模式）
    let submitResult: Promise<boolean> | undefined;
    act(() => {
      result.current.handleChange('farm_name', 'Updated Farm');
      submitResult = result.current.submit('123');
    });

    // 等待提交完成，将异步操作也包裹在act()中
    if (submitResult) {
      await act(async () => {
        const resultValue = await submitResult;
        expect(resultValue).toBe(true);
      });
    }

    expect(dataService.updateFarm).toHaveBeenCalledWith('123', expect.any(Object), expect.any(Array));
    expect(onSuccess).toHaveBeenCalled();
  });

  test('should handle form submission failure', async () => {
    // 模拟服务失败
    const mockAddFarm = dataService.addFarm as any;
    mockAddFarm.mockRejectedValue(new Error('Server error'));

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useFarmForm({ onSuccess }));

    // 填充必要的表单数据并立即提交
    let submitResult: Promise<boolean> | undefined;
    act(() => {
      result.current.handleChange('farm_name', 'Test Farm');
      submitResult = result.current.submit();
    });

    // 等待提交完成，将异步操作也包裹在act()中
    if (submitResult) {
      await act(async () => {
        const resultValue = await submitResult;
        expect(resultValue).toBe(false);
      });
    }

    expect(onSuccess).not.toHaveBeenCalled();
  });

  test('should handle form submission with validation error', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useFarmForm({ onSuccess }));

    // 不填充必填项，直接提交
    let submitResult: Promise<boolean> | undefined;
    act(() => {
      submitResult = result.current.submit();
    });

    // 等待提交完成，将异步操作也包裹在act()中
    if (submitResult) {
      await act(async () => {
        const resultValue = await submitResult;
        expect(resultValue).toBe(false);
      });
    }

    expect(onSuccess).not.toHaveBeenCalled();
    expect(Object.keys(result.current.errors)).toHaveLength(1);
  });

  test('should set original files correctly', async () => {
    const { result } = renderHook(() => useFarmForm());
    const testFiles = [{ id: '1', url: 'test.jpg', business_type: 'farm_images', name: 'test.jpg', type: 'image' }];

    act(() => {
      result.current.setOriginalFiles(testFiles);
    });

    // 由于 originalFiles 是内部状态，我们通过 submit 来验证
    act(() => {
      result.current.handleChange('farm_name', 'Test Farm');
    });

    let submitResult: Promise<boolean> | undefined;
    act(() => {
      submitResult = result.current.submit('123');
    });

    // 等待提交完成
    if (submitResult) {
      await act(async () => {
        await submitResult;
      });
    }

    expect(dataService.updateFarm).toHaveBeenCalledWith('123', expect.any(Object), testFiles);
  });

  test('should set form data correctly using setFormData', () => {
    const { result } = renderHook(() => useFarmForm());

    act(() => {
      result.current.setFormData({
        farm_name: 'Set Farm',
        address: 'Set Address',
        has_treatment_facility: true,
      });
    });

    expect(result.current.formData.farm_name).toBe('Set Farm');
    expect(result.current.formData.address).toBe('Set Address');
    expect(result.current.formData.has_treatment_facility).toBe(true);
  });

  test('should reset message correctly', async () => {
    const { result } = renderHook(() => useFarmForm());

    // 先触发一个错误消息
    let submitResult: Promise<boolean> | undefined;
    act(() => {
      submitResult = result.current.submit();
    });

    // 等待提交完成
    if (submitResult) {
      await act(async () => {
        await submitResult;
      });
    }

    expect(result.current.message).toBe('请检查表单填写是否正确');
    expect(result.current.messageType).toBe('error');

    // 重置消息
    act(() => {
      result.current.resetMessage();
    });

    expect(result.current.message).toBe(null);
    expect(result.current.messageType).toBe(null);
  });
});
