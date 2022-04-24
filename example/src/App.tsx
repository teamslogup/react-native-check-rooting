import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { isDeviceRooted } from 'react-native-check-rooting';

export default function App() {
  const [result, setResult] = React.useState<boolean>();

  React.useEffect(() => {
    isDeviceRooted().then(setResult);
  }, [result]);

  return (
    <View style={styles.container}>
      <Text>is Device Rooted: {`${result}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
