import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

const OnboardingScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Onboarding Screen</Text>
      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button} >
        Go Back
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default OnboardingScreen;
