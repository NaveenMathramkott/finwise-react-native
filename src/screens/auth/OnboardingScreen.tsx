import React, { useRef, useState } from 'react';
import {
 Animated,
 FlatList,
 Image,
 StyleSheet,
 TouchableOpacity,
 View,
 useWindowDimensions,
} from 'react-native';
import { Button, Text as PaperText, Surface, useTheme } from 'react-native-paper';
import Reanimated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import image_01 from '../../../assets/image_01.jpg';
import image_02 from '../../../assets/image_02.jpg';
import image_03 from '../../../assets/image_03.jpg';

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Smart Budgeting',
    subtitle: 'Take control of your finances with ease and precision.',
    iconName: image_01,
  },
  {
    id: '2',
    title: 'Expense Tracking',
    subtitle: 'Track every penny and see exactly where your money goes.',
    iconName: image_02,
  },
  {
    id: '3',
    title: 'AI Insights',
    subtitle: 'Get personalized financial advice from our smart AI assistant.',
    iconName: image_03,
  },
];

const OnboardingScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const updateCurrentSlideIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < slides.length) {
      const offset = nextSlideIndex * width;
      flatListRef?.current?.scrollToOffset({ offset });
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    flatListRef?.current?.scrollToOffset({ offset });
    setCurrentSlideIndex(lastSlideIndex);
  };

  const Footer = () => {
    return (
      <View style={styles.footerContainer}>
        {/* Indicator container */}
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 24, 10],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.indicator,
                  { width: dotWidth, opacity, backgroundColor: theme.colors.primary },
                ]}
              />
            );
          })}
        </View>

        {/* Render buttons */}
        <View style={styles.buttonContainer}>
          {currentSlideIndex === slides.length - 1 ? (
            <View style={{ height: 50 }}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Login')}
                style={styles.getStartedBtn}
                contentStyle={{ height: 50 }}
              >
                Get Started
              </Button>
            </View>
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.skipBtn,
                  {
                    borderColor: theme.colors.primary,
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                  },
                ]}
                onPress={skip}
              >
                <PaperText
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: theme.colors.primary,
                  }}
                >
                  SKIP
                </PaperText>
              </TouchableOpacity>
              <View style={{ width: 15 }} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={[styles.btn, { backgroundColor: theme.colors.primary }]}
              >
                <PaperText
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: 'white',
                  }}
                >
                  NEXT
                </PaperText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.topBg]} />
      
      <Animated.FlatList
        ref={flatListRef}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        renderItem={({ item, index }) => {
            // Apply a local animated transition for when the slide matches
            const isActive = currentSlideIndex === index;
            return (
                <View style={[styles.slide, { width }]}>
                    <Reanimated.View 
                        entering={FadeInDown.duration(600).delay(200)}
                        style={styles.iconWrapper}
                    >
                        <Surface style={styles.iconSurface} elevation={4}>
                            <Image source={item.iconName} style={styles.imageStyle}  />
                        </Surface>
                    </Reanimated.View>
                    
                    <Reanimated.View 
                        entering={FadeInUp.duration(600).delay(400)}
                        style={styles.textContainer}
                    >
                      <PaperText variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>{item.title}</PaperText>
                      <PaperText variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>{item.subtitle}</PaperText>
                    </Reanimated.View>
                </View>
            );
        }}
        keyExtractor={(item) => item.id}
      />
      
      <Surface style={[styles.footerSurface, { backgroundColor: theme.colors.surface }]} elevation={5}>
          <Footer />
      </Surface>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '55%',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
  },
  imageStyle:{
    width: 360,
    height: 400,
    borderRadius: 30,
    resizeMode: 'cover',
  },

  slide: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
  },
  iconWrapper: {
      marginBottom: 60,
  },
  iconSurface: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
  },
  textContainer: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  footerSurface: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingBottom: 20,
      paddingTop: 10,
  },
  footerContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  btn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipBtn: {
    width: 80,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedBtn: {
    width: '100%',
    borderRadius: 16,
    justifyContent: 'center',
  },
});

export default OnboardingScreen;
