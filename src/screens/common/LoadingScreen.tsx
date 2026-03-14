import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import Animated, {
 Easing,
 FadeIn,
 useAnimatedStyle,
 useSharedValue,
 withRepeat,
 withSequence,
 withTiming
} from 'react-native-reanimated';
import Icon from "../../../assets/icon.png";

const LoadingScreen = () => {
  const theme = useTheme();
  
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);
  const ringScale = useSharedValue(1);

  useEffect(() => {
    // Elegant Pulse for Logo
    scale.value = withRepeat(
      withTiming(1.1, { 
        duration: 1200, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      }),
      -1,
      true
    );

    // Fade animation for text
    opacity.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );

    // Expanding Ring Animation
    ringScale.value = withRepeat(
      withTiming(1.8, { 
        duration: 2000, 
        easing: Easing.out(Easing.quad) 
      }),
      -1,
      false
    );
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: withTiming(0, { duration: 2000 }), // This is wrong, it won't repeat properly like this
  }));

  // Better approach for repeating fade-out ring
  const ringOpacity = useSharedValue(0.5);
  useEffect(() => {
    ringOpacity.value = withRepeat(
        withSequence(
            withTiming(0.5, { duration: 0 }),
            withTiming(0, { duration: 2000, easing: Easing.out(Easing.quad) })
        ),
        -1,
        false
    );
  }, []);

  const animatedRingFinalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeIn.duration(1000)} style={styles.content}>
        
        <View style={styles.centerGroup}>
            {/* Expanding Ambient Rings */}
            <Animated.View 
                style={[
                    styles.ring, 
                    { borderColor: theme.colors.primary },
                    animatedRingFinalStyle
                ]} 
            />
            
            {/* Central Logo/Icon */}
            <Animated.View style={[styles.logoContainer, animatedIconStyle]}>
              <Surface style={[styles.iconCircle, { backgroundColor: theme.colors.primary }]} elevation={5}>
                <Image source={Icon} style={{ width: 96, height: 96,borderRadius:30 }} />
              </Surface>
            </Animated.View>
        </View>

        {/* Branding */}
        <Animated.View style={[styles.textContainer, { opacity: opacity }]}>
          <Text style={[styles.brandName, { color: theme.colors.primary }]}>
            Fin<Text style={{ color: theme.colors.onBackground }}>Wise</Text>
          </Text>
          <View style={styles.taglineWrapper}>
            <Text style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>
              Securely syncing your finances
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
      
      {/* Bottom Loading Indicator */}
      <View style={styles.footer}>
          <View style={[styles.progressBarBg, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Animated.View 
                style={[
                    styles.progressBarFill, 
                    { 
                        backgroundColor: theme.colors.primary,
                        width: '40%', // Indeterminate-like animated bar would be better
                    }
                ]} 
              />
          </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  centerGroup: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
      width: 200,
  },
  logoContainer: {
    zIndex: 2,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  ring: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 35,
    borderWidth: 3,
    zIndex: 1,
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1,
  },
  taglineWrapper: {
      marginTop: 4,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.7,
  },
  footer: {
      position: 'absolute',
      bottom: 80,
      width: '50%',
  },
  progressBarBg: {
      height: 6,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
  },
  progressBarFill: {
      height: '100%',
      borderRadius: 10,
  }
});

export default LoadingScreen;
