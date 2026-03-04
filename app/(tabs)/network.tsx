import { indexStyles } from '@/styles/indexStyles';
import { View } from 'react-native';
import NetworkLogger from 'react-native-network-logger';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NetworkScreen() {
  return (

        <SafeAreaView style={indexStyles.safeArea}>
          <View style={{ flex: 1 }}>
      <NetworkLogger />
    </View>
          </SafeAreaView>
    
  );
}
