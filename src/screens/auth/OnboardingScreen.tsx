import React, { useRef, useState } from 'react';
import {
 Animated,
 FlatList,
 Image,
 StyleSheet,
 Text,
 TouchableOpacity,
 View,
 useWindowDimensions,
} from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../utils/theme';

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  image: any;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Smart Budgeting',
    subtitle: 'Take control of your finances with ease and precision.',
    image: require('../../../assets/icon.png'),
  },
  {
    id: '2',
    title: 'Expense Tracking',
    subtitle: 'Track every penny and see exactly where your money goes.',
    image: require('../../../assets/icon.png'),
  },
  {
    id: '3',
    title: 'AI Insights',
    subtitle: 'Get personalized financial advice from our smart AI assistant.',
    image: require('../../../assets/icon.png'),
  },
];

const OnboardingScreen = ({ navigation }: any) => {
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
              outputRange: [10, 20, 10],
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
                  { width: dotWidth, opacity, backgroundColor: COLORS.primary },
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
                  styles.btn,
                  {
                    borderColor: COLORS.primary,
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                  },
                ]}
                onPress={skip}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: COLORS.primary,
                  }}
                >
                  SKIP
                </Text>
              </TouchableOpacity>
              <View style={{ width: 15 }} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={[styles.btn, { backgroundColor: COLORS.primary }]}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: 'white',
                  }}
                >
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: '40%',
    width: '80%',
  },
  textContainer: {
    marginTop: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  title: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 23,
  },
  footerContainer: {
    height: '25%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedBtn: {
    width: '100%',
    borderRadius: 8,
  },
});

export default OnboardingScreen;
