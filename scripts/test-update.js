// 简单的测试脚本，用于验证数据更新流程
const { dataService } = require('../services/dataService');

async function testUpdateFarm() {
  try {
    // 准备测试数据
    const testId = '1'; // 替换为实际的测试ID
    const testFarmData = {
      farm_name: 'Test Farm Updated',
      address: 'Test Address Updated',
      longitude_latitude: '123.456, 78.901',
      responsible_person: 'Test Person Updated',
      contact_phone: '1234567890',
      pond_count: '5',
      water_area_acre: '10.5',
      farm_area_acre: '15.2',
      other_water_area_sqm: '200',
      other_farm_area_acre: '25.5',
      avg_water_depth: '2.5',
      main_species: 'Test Species Updated',
      output: '1000',
      output_value: '50000',
      total_investment: '20000',
      operation_status: 'operating',
      treatment_method: 'biological',
      final_destination: 'river',
      treatment_facility_area: '500',
      treated_discharge_volume: '100',
      farm_images: [],
      tail_water_images: [],
      safety_info: []
    };

    console.log('Testing updateFarm with data:', testFarmData);
    console.log('Testing with id:', testId);

    // 调用updateFarm方法
    const result = await dataService.updateFarm(testId, testFarmData);

    console.log('Update result:', result);

    if (result) {
      console.log('Update successful!');
      console.log('Updated farm name:', result.farm_name);
      console.log('Updated address:', result.address);
    } else {
      console.log('Update failed!');
    }
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testUpdateFarm();
