import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import {
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome'
  
  const { width, height } = Dimensions.get('window')
  
  export default function WelcomeScreen() {
    const navigation = useNavigation()
    const scrollViewRef = useRef(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    const totalSlides = 5
  
    // Enhanced animation values
    const slideOpacity = useRef(new Animated.Value(1)).current
    const titleScale = useRef(new Animated.Value(1)).current
    const iconPulse = useRef(new Animated.Value(1)).current
    const glowOpacity = useRef(new Animated.Value(0.5)).current
    
    // Floating particles
    const particles = useRef(Array(12).fill(0).map(() => ({
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.5)
    }))).current
  
    useEffect(() => {
      // Start particle animations
      particles.forEach((particle, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 600),
            Animated.parallel([
              Animated.timing(particle.opacity, {
                toValue: 0.8,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.translateY, {
                toValue: -100,
                duration: 4000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.scale, {
                toValue: 1.2,
                duration: 2000,
                useNativeDriver: true,
              })
            ]),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            })
          ])
        ).start()
      })
  
      // Continuous glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.5,
            duration: 2000,
            useNativeDriver: true,
          })
        ])
      ).start()
  
      // Icon pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(iconPulse, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(iconPulse, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          })
        ])
      ).start()
    }, [])
  
    const animateSlideChange = () => {
      // Slide transition animation
      Animated.sequence([
        Animated.timing(slideOpacity, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start()
  
      // Title scale animation
      Animated.sequence([
        Animated.timing(titleScale, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(titleScale, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        })
      ]).start()
    }
  
    const handleScroll = (event) => {
      const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width)
      if (slideIndex !== currentSlide && slideIndex >= 0 && slideIndex < totalSlides) {
        setCurrentSlide(slideIndex)
        animateSlideChange()
      }
    }
  
    const nextSlide = () => {
      if (currentSlide < totalSlides - 1) {
        const nextIndex = currentSlide + 1
        setCurrentSlide(nextIndex)
        scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true })
        animateSlideChange()
      }
    }
  
    const skipToEnd = () => {
      const lastIndex = totalSlides - 1
      setCurrentSlide(lastIndex)
      scrollViewRef.current?.scrollTo({ x: lastIndex * width, animated: true })
      animateSlideChange()
    }
  
    // Floating particles component
    const FloatingParticles = () => (
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {particles.map((particle, index) => (
          <Animated.View
            key={index}
            style={{
              position: 'absolute',
              left: `${(index * 8 + 10) % 90}%`,
              top: `${(index * 12 + 20) % 80}%`,
              opacity: particle.opacity,
              transform: [
                { translateY: particle.translateY },
                { scale: particle.scale }
              ]
            }}
          >
            <Icon 
              name={['star', 'heart', 'diamond', 'circle'][index % 4]} 
              size={4 + (index % 3) * 2} 
              color="rgba(255,255,255,0.8)" 
            />
          </Animated.View>
        ))}
      </View>
    )
  
    // Enhanced slide content with better visibility
    const slides = [
      {
        id: 0,
        icon: 'lightbulb-o',
        badgeIcon: 'magic',
        badgeColor: '#10b981',
        title: 'Welcome to EduLearn AI',
        subtitle: '🚀 Your Personal Learning Revolution',
        description: 'Experience AI that understands how YOU learn best. No more one-size-fits-all education.',
        highlight: 'PERSONALIZED',
        bgGradient: ['rgba(16, 185, 129, 0.2)', 'rgba(59, 130, 246, 0.1)']
      },
      {
        id: 1,
        icon: 'bullseye',
        badgeIcon: 'check',
        badgeColor: '#3b82f6',
        title: 'Precision Learning',
        subtitle: '🎯 Smart. Adaptive. Effective.',
        description: 'Get exactly what you need, when you need it. Our AI adapts to your pace and learning style.',
        highlight: 'ADAPTIVE',
        bgGradient: ['rgba(59, 130, 246, 0.2)', 'rgba(139, 92, 246, 0.1)']
      },
      {
        id: 2,
        icon: 'users',
        badgeIcon: 'heart',
        badgeColor: '#8b5cf6',
        title: 'Built for Everyone',
        subtitle: '🧠 Student to Professional',
        description: 'Whether you\'re 15 or 50, studying or working - EduLearn grows with your ambitions.',
        highlight: 'INCLUSIVE',
        bgGradient: ['rgba(139, 92, 246, 0.2)', 'rgba(236, 72, 153, 0.1)']
      },
      {
        id: 3,
        icon: 'rocket',
        badgeIcon: 'bolt',
        badgeColor: '#f59e0b',
        title: 'Break the Mold',
        subtitle: '🏫 Beyond Traditional Limits',
        description: 'Frustrated with rigid classrooms? Transform your learning with AI-powered personalization.',
        highlight: 'REVOLUTIONARY',
        bgGradient: ['rgba(245, 158, 11, 0.2)', 'rgba(239, 68, 68, 0.1)']
      },
      {
        id: 4,
        icon: 'graduation-cap',
        badgeIcon: 'star',
        badgeColor: '#10b981',
        title: 'Ready to Excel?',
        subtitle: '✨ Your Journey Starts Now',
        description: 'Join 10,000+ learners who\'ve unlocked their potential with personalized AI education.',
        highlight: 'TRANSFORM',
        bgGradient: ['rgba(16, 185, 129, 0.2)', 'rgba(6, 182, 212, 0.1)']
      }
    ]
  
    const currentSlideData = slides[currentSlide]
  
    return (
      <View style={{ flex: 1 }}>
        {/* Dynamic Background with Gradient */}
        <Animated.View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#1e1b4b'
        }}>
          {/* Gradient Overlay */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#4f46e5'
          }} />
          
          {/* Dynamic Glow Effect */}
          <Animated.View style={{
            position: 'absolute',
            top: height * 0.2,
            left: width * 0.1,
            right: width * 0.1,
            height: height * 0.4,
            borderRadius: 200,
            backgroundColor: currentSlideData?.badgeColor || '#10b981',
            opacity: glowOpacity.interpolate({
              inputRange: [0.5, 1],
              outputRange: [0.1, 0.2]
            }),
            transform: [{ scale: glowOpacity }]
          }} />
        </Animated.View>
  
        {/* Floating Particles */}
        <FloatingParticles />
  
        <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
  
        <SafeAreaView style={{ flex: 1, zIndex: 10 }}>
          {/* Enhanced Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 8
          }}>
            <View>
              <Text style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold'
              }}>
                EduLearn AI
              </Text>
              <Text style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 12,
                fontWeight: '500'
              }}>
                Powered by Advanced AI
              </Text>
            </View>
            
            {currentSlide < totalSlides - 1 && (
              <TouchableOpacity 
                onPress={skipToEnd}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.2)'
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 14,
                  fontWeight: '600'
                }}>
                  Skip
                </Text>
              </TouchableOpacity>
            )}
          </View>
  
          {/* App Slogan with Animation */}
          <Animated.Text style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 30,
            fontStyle: 'italic',
            fontWeight: '500',
            transform: [{ scale: titleScale }]
          }}>
            Smarter Learning. Powered by You. Enhanced by AI.
          </Animated.Text>
  
          {/* Main Content */}
          <Animated.View style={{ 
            flex: 1, 
            opacity: slideOpacity // Ensures content is always visible
          }}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
              onScrollEndDrag={handleScroll}
              scrollEventThrottle={16}
              style={{ flex: 1 }}
            >
              {slides.map((slide, index) => (
                <View 
                  key={slide.id}
                  style={{ 
                    width, 
                    flex: 1,
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    paddingHorizontal: 32,
                    paddingVertical: 40
                  }}
                >
                  {/* Highlight Badge */}
                  <View style={{
                    backgroundColor: slide.badgeColor,
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 20,
                    marginBottom: 20,
                    shadowColor: slide.badgeColor,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8
                  }}>
                    <Text style={{
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 'bold',
                      letterSpacing: 1
                    }}>
                      {slide.highlight}
                    </Text>
                  </View>
  
                  {/* Enhanced Icon Section */}
                  <Animated.View style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: 32,
                    borderRadius: 50,
                    marginBottom: 32,
                    borderWidth: 2,
                    borderColor: 'rgba(255,255,255,0.2)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.4,
                    shadowRadius: 20,
                    elevation: 15,
                    transform: [{ scale: iconPulse }]
                  }}>
                    <View style={{ alignItems: 'center', position: 'relative' }}>
                      <Icon name={slide.icon} size={56} color="white" />
                      <View style={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        backgroundColor: slide.badgeColor,
                        borderRadius: 16,
                        padding: 6,
                        borderWidth: 2,
                        borderColor: 'white'
                      }}>
                        <Icon name={slide.badgeIcon} size={16} color="white" />
                      </View>
                    </View>
                  </Animated.View>
  
                  {/* Enhanced Text Content - ALWAYS VISIBLE */}
                  <View style={{ opacity: 1, zIndex: 10 }}>
                    <Animated.Text style={{
                      color: 'white',
                      fontSize: 32,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginBottom: 12,
                      lineHeight: 38,
                      textShadowColor: 'rgba(0,0,0,0.3)',
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 4,
                      transform: [{ scale: titleScale }]
                    }}>
                      {slide.title}
                    </Animated.Text>
  
                    <Text style={{
                      color: 'rgba(255,255,255,0.95)',
                      fontSize: 20,
                      fontWeight: '600',
                      textAlign: 'center',
                      marginBottom: 24,
                      textShadowColor: 'rgba(0,0,0,0.2)',
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2
                    }}>
                      {slide.subtitle}
                    </Text>
  
                    <Text style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: 18,
                      textAlign: 'center',
                      lineHeight: 26,
                      paddingHorizontal: 8,
                      fontWeight: '500',
                      textShadowColor: 'rgba(0,0,0,0.2)',
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2
                    }}>
                      {slide.description}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </Animated.View>
  
          {/* Enhanced Progress Indicators */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 32,
            backgroundColor: 'rgba(255,255,255,0.1)',
            alignSelf: 'center',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)'
          }}>
            {Array(totalSlides).fill(0).map((_, index) => (
              <Animated.View
                key={index}
                style={{
                  width: currentSlide === index ? 32 : 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.4)',
                  marginHorizontal: 5,
                  shadowColor: currentSlide === index ? '#fff' : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                  elevation: 4
                }}
              />
            ))}
          </View>
  
          {/* Enhanced Action Buttons */}
          <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
            {currentSlide === totalSlides - 1 ? (
              // Final slide - Enhanced CTA buttons
              <View style={{ gap: 16 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SignUp')}
                  style={{
                    backgroundColor: 'white',
                    paddingVertical: 18,
                    borderRadius: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.2)'
                  }}
                >
                  <Text style={{
                    color: '#4f46e5',
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    🚀 Transform Your Learning
                  </Text>
                </TouchableOpacity>
  
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 12
                }}>
                  <Text style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: 16,
                    fontWeight: '500'
                  }}>
                    Already learning with us?
                  </Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('Login')}
                    style={{ 
                      marginLeft: 8,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 16
                    }}
                  >
                    <Text style={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 'bold'
                    }}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
  
                {/* Enhanced Guest Access */}
                <TouchableOpacity
                  style={{
                    borderWidth: 2,
                    borderColor: 'rgba(255,255,255,0.3)',
                    paddingVertical: 14,
                    borderRadius: 16,
                    marginTop: 12,
                    backgroundColor: 'rgba(255,255,255,0.05)'
                  }}
                >
                  <Text style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: 16,
                    textAlign: 'center',
                    fontWeight: '600'
                  }}>
                    🔍 Explore as Guest
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Enhanced Next button
              <TouchableOpacity
                onPress={nextSlide}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  paddingVertical: 16,
                  paddingHorizontal: 40,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.3)',
                  alignSelf: 'center',
                  shadowColor: '#fff',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 8
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  Continue →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </View>
    )
  }