import { supabase, supabaseInitError } from '@/lib/supabase';

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  error?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  searchQuery?: string;
}

export type FarmRow = Record<string, any>;

export const dataService = {
  async getFarms(params: PaginationParams): Promise<PaginatedResponse<FarmRow>> {
    if (!supabase) {
      return {
        data: [],
        totalCount: 0,
        error: supabaseInitError ?? 'Supabase 未初始化'
      };
    }

    try {
      // Calculate offset
      const offset = (params.page - 1) * params.pageSize;

      // Build query with files
      let query = supabase
        .from('aquaculture_farms')
        .select(`
          *,
          files (url, business_type, type)
        `, { count: 'exact' });

      // Add search condition if searchQuery is provided
      if (params.searchQuery && params.searchQuery.trim()) {
        const searchTerm = `%${params.searchQuery.trim()}%`;
        // 搜索多个字段：养殖场名称、地址、负责人、联系电话、经纬度等
        query = query.or(`farm_name.ilike.${searchTerm},address.ilike.${searchTerm},responsible_person.ilike.${searchTerm},contact_phone.ilike.${searchTerm},longitude_latitude.ilike.${searchTerm}`);
      }

      // Get data and count
      const { data: farmData, error: fetchError, count } = await query
        .range(offset, offset + params.pageSize - 1);

      if (fetchError) {
        console.warn('Supabase error:', fetchError);
        return {
          data: [],
          totalCount: 0,
          error: fetchError.message
        };
      } else {
        const cleaned = farmData?.map((row) => {
            // 按业务类型分组文件
            const farmImages: string[] = [];
            const tailWaterImages: string[] = [];
            const safetyInfoFiles: string[] = [];

            row.files?.forEach((file: any) => {
              switch (file.business_type) {
                case 'farm_images':
                  farmImages.push(file.url);
                  break;
                case 'tail_water_images':
                  tailWaterImages.push(file.url);
                  break;
                case 'safety_info':
                  safetyInfoFiles.push(file.url);
                  break;
              }
            });

            // 去掉 files 字段
            const { files, ...rest } = row;
            
            // 添加文件URL
            return {
              ...rest,
              farm_images: farmImages,
              tail_water_images: tailWaterImages,
              safety_info: safetyInfoFiles
            };
          }) ?? [];

        return {
          data: cleaned,
          totalCount: count ?? 0
        };
      }
    } catch (e) {
      console.error('Fetch farms error:', e);
      return {
        data: [],
        totalCount: 0,
        error: '获取数据失败，请稍后重试'
      };
    }
  },

  async getUserInfo(): Promise<FarmRow | null> {
    if (!supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.warn('Get user info error:', error);
        return null;
      }

      return data;
    } catch (e) {
      console.error('Get user info error:', e);
      return null;
    }
  },

  // 批量保存文件到files表
  async saveFiles(farmId: string, fileUrls: string[], businessType: string, fileType: string): Promise<void> {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return;
    }

    try {
      console.log(`开始保存${businessType}文件，数量: ${fileUrls.length}`);
      
      // 添加新的文件
      if (Array.isArray(fileUrls) && fileUrls.length > 0) {
        // 准备批量插入的数据
        const fileData = fileUrls.map((fileUrl: string) => ({
          farm_id: farmId,
          url: fileUrl,
          business_type: businessType,
          type: fileType,
          created_at: new Date().toISOString()
        }));
        
        console.log(`批量保存${fileData.length}个文件`);
        
        // 批量插入
        const { error } = await supabase
          .from('files')
          .insert(fileData);
        
        if (error) {
          console.error(`批量保存${businessType}文件失败:`, error);
          throw error;
        }
        
        console.log(`${businessType}文件批量保存完成`);
      } else {
        console.log(`没有${businessType}文件需要保存`);
      }
    } catch (error) {
      console.error(`保存${businessType}文件失败:`, error);
      throw error; // 抛出错误，让调用方知道保存失败
    }
  },

  // 获取文件URL列表
  async getFiles(farmId: string, businessType: string): Promise<string[]> {
    if (!supabase) return [];

    try {
      const { data: files, error } = await supabase
        .from('files')
        .select('url')
        .eq('farm_id', farmId)
        .eq('business_type', businessType);

      if (error) {
        console.warn(`获取${businessType}文件失败:`, error);
        return [];
      }

      return files?.map((file: any) => file.url) || [];
    } catch (error) {
      console.error(`获取${businessType}文件失败:`, error);
      return [];
    }
  },

  async getFarmById(id: string): Promise<FarmRow | null> {
    if (!supabase) {
      return null;
    }

    try {
      // 使用单个查询获取farm信息和所有相关文件
      const { data, error } = await supabase
        .from('aquaculture_farms')
        .select(`
          *,
          files (id, url, business_type, type, name, size)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.warn('Get farm by id error:', error);
        return null;
      }

      // 按业务类型分组文件
      const farmImages: { id: string; url: string; name: string; type: string; size: number }[] = [];
      const tailWaterImages: { id: string; url: string; name: string; type: string; size: number }[] = [];
      const safetyInfoFiles: { id: string; url: string; name: string; type: string; size: number }[] = [];

      data.files?.forEach((file: any) => {
        switch (file.business_type) {
          case 'farm_images':
            farmImages.push({ id: file.id, url: file.url, name: file.name, type: file.type, size: file.size || 0 });
            break;
          case 'tail_water_images':
            tailWaterImages.push({ id: file.id, url: file.url, name: file.name, type: file.type, size: file.size || 0 });
            break;
          case 'safety_info':
            safetyInfoFiles.push({ id: file.id, url: file.url, name: file.name, type: file.type, size: file.size || 0 });
            break;
        }
      });

      // 去掉 created_at 字段和 files 字段
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { created_at, files, ...rest } = data;
      
      // 添加文件信息
      return {
        ...rest,
        farm_images: farmImages,
        tail_water_images: tailWaterImages,
        safety_info: safetyInfoFiles
      };
    } catch (e) {
      console.error('Get farm by id error:', e);
      return null;
    }
  },

  async updateFarm(id: string, data: FarmRow, existingFiles?: any[]): Promise<FarmRow | null> {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return null;
    }

    try {
      console.log('Update farm with id:', id);
      console.log('Update data:', data);

      // 分离文件字段
      const { farm_images, tail_water_images, safety_info, ...farmData } = data;
      
      // 确保其他字段存在
      const updateData = {
        ...farmData
      };

      console.log('Processed update data:', updateData);

      // 使用update操作直接返回修改后的数据
      const { data: updatedFarm, error: updateError } = await supabase
        .from('aquaculture_farms')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.warn('Update farm error:', updateError);
        return null;
      }

      // 准备文件数据对象，包含多个文件数组
      const fileGroups = {
        farm_images: {
          files: farm_images || [],
          businessType: 'farm_images',
          defaultType: 'image'
        },
        tail_water_images: {
          files: tail_water_images || [],
          businessType: 'tail_water_images',
          defaultType: 'image'
        },
        safety_info: {
          files: safety_info || [],
          businessType: 'safety_info',
          defaultType: 'file'
        }
      };

      // 批量保存所有文件
      if (updatedFarm) {
        console.log('开始处理文件更新');
        
        try {
          let filesData = existingFiles;
          
          // 如果没有提供现有文件信息，则查询数据库
          if (!filesData) {
            const { data: dbFiles, error: queryError } = await supabase
              .from('files')
              .select('id, url, business_type, name, type')
              .eq('farm_id', id);
            
            if (queryError) {
              console.error('查询现有文件失败:', queryError);
            } else {
              filesData = dbFiles;
              console.log('从数据库查询现有文件数量:', filesData?.length || 0);
            }
          } else {
            console.log('使用提供的现有文件数量:', filesData.length);
          }
          
          if (filesData) {
            // 对比现有文件和新文件，找出差异
            const existingFileMap = new Map<string, any>();
            filesData.forEach(file => {
              existingFileMap.set(file.url, file);
            });
            
            // 准备所有新文件数据
            const allFilesData: { farm_id: string; url: string; name: string; business_type: string; type: string; size: number; }[] = [];
            
            // 处理每个文件组
            Object.values(fileGroups).forEach(group => {
              const { files, businessType, defaultType } = group;
              
              if (Array.isArray(files) && files.length > 0) {
                files.forEach((file: any) => {
                  const url = typeof file === 'string' ? file : file.url;
                  const name = typeof file === 'string' ? url.split('/').pop() || '' : file.name;
                  const type = typeof file === 'string' ? defaultType : file.type || defaultType;
                  const size = typeof file === 'string' ? 0 : file.size || 0;
                  allFilesData.push({
                    farm_id: id,
                    url: url,
                    name: name,
                    business_type: businessType,
                    type: type,
                    size: size,
                  });
                });
              }
            });
            
            // 找出需要删除的文件（在现有文件中但不在新文件中的）
            const filesToDelete: string[] = [];
            existingFileMap.forEach((file) => {
              const existsInNew = allFilesData.some(newFile => newFile.url === file.url);
              if (!existsInNew) {
                filesToDelete.push(file.id);
              }
            });
            
            // 找出需要新增的文件（在新文件中但不在现有文件中的）
            const filesToAdd: typeof allFilesData = [];
            allFilesData.forEach(newFile => {
              if (!existingFileMap.has(newFile.url)) {
                filesToAdd.push(newFile);
              }
            });
            
            console.log('需要删除的文件数量:', filesToDelete.length);
            console.log('需要新增的文件数量:', filesToAdd.length);
            
            // 执行删除操作
            if (filesToDelete.length > 0) {
              try {
                await supabase
                  .from('files')
                  .delete()
                  .in('id', filesToDelete);
                console.log('文件删除成功');
              } catch (deleteError) {
                console.warn('删除文件失败（可能是权限问题）:', deleteError);
                // 继续执行，不因为删除失败而中断整个更新过程
              }
            }
            
            // 执行新增操作
            if (filesToAdd.length > 0) {
              const { error } = await supabase
                .from('files')
                .insert(filesToAdd);
              
              if (error) {
                console.error('批量保存文件失败:', error);
              } else {
                console.log('文件批量保存完成');
              }
            } else {
              console.log('没有新文件需要保存');
            }
          }
        } catch (error) {
          console.error('更新文件失败:', error);
          // 继续执行，不因为文件保存失败而中断整个更新过程
        }
      }

      console.log('Updated farm data:', updatedFarm);

      // 去掉created_at字段
      if (updatedFarm) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { created_at, ...rest } = updatedFarm;
        
        // 直接返回传入的文件数据，避免再次调用接口
        return {
          ...rest,
          farm_images: farm_images || [],
          tail_water_images: tail_water_images || [],
          safety_info: safety_info || []
        };
      }

      console.warn('No updated farm data returned');
      return null;
    } catch (e) {
      console.error('Update farm error:', e);
      return null;
    }
  },

  async addFarm(data: FarmRow): Promise<FarmRow | null> {
    if (!supabase) {
      return null;
    }

    try {
      // 分离文件字段
      const { farm_images, tail_water_images, safety_info, ...farmData } = data;
      
      // 构建插入数据
      const insertData = {
        ...farmData
      };

      const { data: insertedFarm, error } = await supabase
        .from('aquaculture_farms')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.warn('Add farm error:', error);
        return null;
      }

      // 准备所有文件数据
      const allFilesData: { farm_id: string; url: string; name: string; business_type: string; type: string; created_at: string }[] = [];
      
      // 添加养殖情况图片
      if (Array.isArray(farm_images) && farm_images.length > 0) {
        farm_images.forEach((file: any) => {
          const url = typeof file === 'string' ? file : file.url;
          const name = typeof file === 'string' ? url.split('/').pop() || '' : file.name;
          allFilesData.push({
            farm_id: insertedFarm.id,
            url: url,
            name: name,
            business_type: 'farm_images',
            type: 'image',
            created_at: new Date().toISOString()
          });
        });
      }
      
      // 添加尾水处理图片
      if (Array.isArray(tail_water_images) && tail_water_images.length > 0) {
        tail_water_images.forEach((file: any) => {
          const url = typeof file === 'string' ? file : file.url;
          const name = typeof file === 'string' ? url.split('/').pop() || '' : file.name;
          allFilesData.push({
            farm_id: insertedFarm.id,
            url: url,
            name: name,
            business_type: 'tail_water_images',
            type: 'image',
            created_at: new Date().toISOString()
          });
        });
      }
      
      // 添加安全信息文件
      if (Array.isArray(safety_info) && safety_info.length > 0) {
        safety_info.forEach((file: any) => {
          const url = typeof file === 'string' ? file : file.url;
          const name = typeof file === 'string' ? url.split('/').pop() || '' : file.name;
          allFilesData.push({
            farm_id: insertedFarm.id,
            url: url,
            name: name,
            business_type: 'safety_info',
            type: 'file',
            created_at: new Date().toISOString()
          });
        });
      }
      
      // 批量保存所有文件
      if (insertedFarm && allFilesData.length > 0) {
        console.log('开始批量保存所有文件，数量:', allFilesData.length);
        
        try {
          // 批量插入新文件
          const { error } = await supabase
            .from('files')
            .insert(allFilesData);
          
          if (error) {
            console.error('批量保存文件失败:', error);
          } else {
            console.log('文件批量保存完成');
          }
        } catch (error) {
          console.error('保存文件失败:', error);
          // 继续执行，不因为文件保存失败而中断整个添加过程
        }
      }

      // 去掉created_at字段
      if (insertedFarm) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { created_at, ...rest } = insertedFarm;
        
        // 直接返回传入的文件数据，避免再次调用接口
        return {
          ...rest,
          farm_images: farm_images || [],
          tail_water_images: tail_water_images || [],
          safety_info: safety_info || []
        };
      }

      return null;
    } catch (e) {
      console.error('Add farm error:', e);
      return null;
    }
  }
};
