import { FarmFile, FarmRow, PaginatedResponse, PaginationParams } from '@/types/farm';
import { checkSupabase } from '@/utils/apiHelper';

export type { FarmFile, FarmRow, PaginatedResponse, PaginationParams };

export const dataService = {
  async getFarms(params: PaginationParams): Promise<PaginatedResponse<FarmRow>> {
    const check = await checkSupabase();
    if (!check.ok) {
      return { data: [], totalCount: 0, error: check.error };
    }

    try {
      const offset = (params.page - 1) * params.pageSize;

      let query = check.client
        .from('aquaculture_farms')
        .select(`
          *,
          files (url, business_type, type, name, size)
        `, { count: 'exact' })
        .is('deleted_at', null);

      if (params.searchQuery && params.searchQuery.trim()) {
        const searchTerm = `%${params.searchQuery.trim()}%`;
        query = query.or(`farm_name.ilike.${searchTerm},address.ilike.${searchTerm},responsible_person.ilike.${searchTerm},contact_phone.ilike.${searchTerm},longitude_latitude.ilike.${searchTerm}`);
      }

      const { data: farmData, error: fetchError, count } = await query
        .range(offset, offset + params.pageSize - 1);

      if (fetchError) {
        return { data: [], totalCount: 0, error: fetchError.message };
      }

      const cleaned = farmData?.map((row) => {
        const farmImages: { url: string; name: string; size: number }[] = [];
        const tailWaterImages: { url: string; name: string; size: number }[] = [];
        const safetyInfoFiles: { url: string; name: string; size: number }[] = [];

        row.files?.forEach((file: any) => {
          const fileInfo = {
            url: file.url,
            name: file.name || file.url.split('/').pop() || '',
            size: file.size || 0
          };
          switch (file.business_type) {
            case 'farm_images':
              farmImages.push(fileInfo);
              break;
            case 'tail_water_images':
              tailWaterImages.push(fileInfo);
              break;
            case 'safety_info':
              safetyInfoFiles.push(fileInfo);
              break;
          }
        });

        const { files, ...rest } = row;
        
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
    } catch (e) {
      return {
        data: [],
        totalCount: 0,
        error: '获取数据失败，请稍后重试'
      };
    }
  },

  async getUserInfo(): Promise<FarmRow | null> {
    const check = await checkSupabase();
    if (!check.ok) return null;

    try {
      const { data, error } = await check.client
        .from('user')
        .select('*')
        .limit(1)
        .single();

      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  async saveFiles(farmId: string, files: { url: string; name: string; size?: number }[], businessType: string, fileType: string): Promise<void> {
    const check = await checkSupabase();
    if (!check.ok) return;

    try {
      if (Array.isArray(files) && files.length > 0) {
        const fileData = files.map((file) => ({
          farm_id: farmId,
          url: file.url,
          name: file.name,
          size: file.size || 0,
          business_type: businessType,
          type: fileType,
          created_at: new Date().toISOString()
        }));
        
        const { error } = await check.client
          .from('files')
          .insert(fileData);
        
        if (error) throw error;
      }
    } catch (error) {
      throw error;
    }
  },

  async getFiles(farmId: string, businessType: string): Promise<string[]> {
    const check = await checkSupabase();
    if (!check.ok) return [];

    try {
      const { data: files, error } = await check.client
        .from('files')
        .select('url')
        .eq('farm_id', farmId)
        .eq('business_type', businessType);

      if (error) return [];
      return files?.map((file: any) => file.url) || [];
    } catch (error) {
      return [];
    }
  },

  async getFarmById(id: string): Promise<FarmRow | null> {
    const check = await checkSupabase();
    if (!check.ok) return null;

    try {
      const { data, error } = await check.client
        .from('aquaculture_farms')
        .select(`
          *,
          files (id, url, business_type, type, name, size)
        `)
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) return null;

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

      const { created_at, files, ...rest } = data;
      
      return {
        ...rest,
        farm_images: farmImages,
        tail_water_images: tailWaterImages,
        safety_info: safetyInfoFiles
      };
    } catch (e) {
      return null;
    }
  },

  async updateFarm(id: string, data: FarmRow, existingFiles?: any[]): Promise<FarmRow | null> {
    const check = await checkSupabase();
    if (!check.ok) return null;

    try {
      const { farm_images, tail_water_images, safety_info, ...farmData } = data;
      
      const updateData = { ...farmData };

      const { data: updatedFarm, error: updateError } = await check.client
        .from('aquaculture_farms')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) return null;

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

      if (updatedFarm) {
        try {
          let filesData = existingFiles;
          
          if (!filesData) {
            const { data: dbFiles, error: queryError } = await check.client
              .from('files')
              .select('id, url, business_type, name, type')
              .eq('farm_id', id);
            
            if (!queryError) {
              filesData = dbFiles;
            }
          }
          
          if (filesData) {
            const existingFileMap = new Map<string, any>();
            filesData.forEach(file => {
              existingFileMap.set(file.url, file);
            });
            
            const allFilesData: { farm_id: string; url: string; name: string; business_type: string; type: string; size: number; }[] = [];
            
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
            
            const filesToDelete: string[] = [];
            existingFileMap.forEach((file) => {
              const existsInNew = allFilesData.some(newFile => newFile.url === file.url);
              if (!existsInNew) {
                filesToDelete.push(file.id);
              }
            });
            
            const filesToAdd: typeof allFilesData = [];
            allFilesData.forEach(newFile => {
              if (!existingFileMap.has(newFile.url)) {
                filesToAdd.push(newFile);
              }
            });
            
            if (filesToDelete.length > 0) {
              try {
                await check.client
                  .from('files')
                  .delete()
                  .in('id', filesToDelete);
              } catch (deleteError) {
              }
            }
            
            if (filesToAdd.length > 0) {
              await check.client
                .from('files')
                .insert(filesToAdd);
            }
          }
        } catch (error) {
        }
      }

      if (updatedFarm) {
        const { created_at, ...rest } = updatedFarm;
        
        return {
          ...rest,
          farm_images: farm_images || [],
          tail_water_images: tail_water_images || [],
          safety_info: safety_info || []
        };
      }

      return null;
    } catch (e) {
      return null;
    }
  },

  async addFarm(data: FarmRow): Promise<FarmRow | null> {
    const check = await checkSupabase();
    if (!check.ok) return null;

    try {
      const { farm_images, tail_water_images, safety_info, ...farmData } = data;
      
      const insertData = { ...farmData };

      const { data: insertedFarm, error } = await check.client
        .from('aquaculture_farms')
        .insert(insertData)
        .select()
        .single();

      if (error) return null;

      const allFilesData: { farm_id: string; url: string; name: string; size: number; business_type: string; type: string; created_at: string }[] = [];
      
      if (Array.isArray(farm_images) && farm_images.length > 0) {
        farm_images.forEach((file: any) => {
          const url = typeof file === 'string' ? file : file.url;
          const name = typeof file === 'string' ? url.split('/').pop() || '' : file.name;
          const size = typeof file === 'string' ? 0 : file.size || 0;
          allFilesData.push({
            farm_id: insertedFarm.id,
            url: url,
            name: name,
            size: size,
            business_type: 'farm_images',
            type: 'image',
            created_at: new Date().toISOString()
          });
        });
      }
      
      if (Array.isArray(tail_water_images) && tail_water_images.length > 0) {
        tail_water_images.forEach((file: any) => {
          const url = typeof file === 'string' ? file : file.url;
          const name = typeof file === 'string' ? url.split('/').pop() || '' : file.name;
          const size = typeof file === 'string' ? 0 : file.size || 0;
          allFilesData.push({
            farm_id: insertedFarm.id,
            url: url,
            name: name,
            size: size,
            business_type: 'tail_water_images',
            type: 'image',
            created_at: new Date().toISOString()
          });
        });
      }
      
      if (Array.isArray(safety_info) && safety_info.length > 0) {
        safety_info.forEach((file: any) => {
          const url = typeof file === 'string' ? file : file.url;
          const name = typeof file === 'string' ? url.split('/').pop() || '' : file.name;
          const size = typeof file === 'string' ? 0 : file.size || 0;
          allFilesData.push({
            farm_id: insertedFarm.id,
            url: url,
            name: name,
            size: size,
            business_type: 'safety_info',
            type: 'file',
            created_at: new Date().toISOString()
          });
        });
      }
      
      if (insertedFarm && allFilesData.length > 0) {
        try {
          await check.client
            .from('files')
            .insert(allFilesData);
        } catch (error) {
        }
      }

      if (insertedFarm) {
        const { created_at, ...rest } = insertedFarm;
        
        return {
          ...rest,
          farm_images: farm_images || [],
          tail_water_images: tail_water_images || [],
          safety_info: safety_info || []
        };
      }

      return null;
    } catch (e) {
      return null;
    }
  },

  async softDeleteFarm(id: string): Promise<boolean> {
    const check = await checkSupabase();
    if (!check.ok) return false;

    try {
      const { data: { session } } = await check.client.auth.getSession();
      if (!session) return false;
      
      const { error } = await check.client
        .from('aquaculture_farms')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      return !error;
    } catch (e) {
      return false;
    }
  }
};
