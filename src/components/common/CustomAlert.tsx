import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import Animated, {
 runOnJS,
 useAnimatedStyle,
 useSharedValue,
 withSpring,
 withTiming
} from 'react-native-reanimated';
import { setAlertRef } from '../../utils/AlertService';

const { width, height } = Dimensions.get('window');

const CustomAlertComponent = () => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<any>(null);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  const hide = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.9, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(setVisible)(false);
        runOnJS(setData)(null);
      }
    });
  }, [opacity, scale]);

  const show = useCallback((options: any) => {
    setData(options);
    setVisible(true);
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, { damping: 30 });
  }, [opacity, scale]);

  // Link to service
  useEffect(() => {
    setAlertRef({ show, hide });
    return () => setAlertRef(null);
  }, [show, hide]);

  useEffect(() => {
    const backAction = () => {
      if (visible) {
        hide();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [visible, hide]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible || !data) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={hide}>
        <Animated.View 
          style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }, backdropStyle]} 
        />
      </TouchableWithoutFeedback>
      
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View style={[styles.alertWrapper, contentStyle]}>
          <Surface style={[styles.alertBox, { backgroundColor: theme.colors.surface }]} elevation={5}>
            <View style={styles.content}>
              <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                {data.title}
              </Text>
              
              {data.subtitle && (
                <Text variant="labelLarge" style={[styles.subtitle, { color: theme.colors.primary }]}>
                  {data.subtitle}
                </Text>
              )}
              
              <Text variant="bodyMedium" style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
                {data.message}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              {data.buttons.map((btn: any, index: number) => (
                <Button
                  key={index}
                  mode={btn.style === 'destructive' ? 'contained' : btn.style === 'cancel' ? 'outlined' : 'text'}
                  onPress={() => {
                    hide();
                    btn.onPress?.();
                  }}
                  style={[
                    styles.button,
                    btn.style === 'destructive' && { backgroundColor: theme.colors.error },
                    index > 0 && { marginLeft: 8 }
                  ]}
                  textColor={btn.style === 'destructive' ? 'white' : btn.style === 'cancel' ? theme.colors.outline : theme.colors.primary}
                >
                  {btn.text}
                </Button>
              ))}
            </View>
          </Surface>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  alertBox: {
    borderRadius: 28,
    overflow: 'hidden',
    padding: 24,
  },
  content: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  message: {
    lineHeight: 20,
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    minWidth: 80,
  },
});

export default CustomAlertComponent;
