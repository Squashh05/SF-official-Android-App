import { galleryImages } from "@/constants/imagesData";
import * as React from "react";
import { Dimensions, Image, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
	ICarouselInstance,
	Pagination,
} from "react-native-reanimated-carousel";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { 
	withRepeat, 
	withSequence, 
	withTiming,
	useAnimatedStyle,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

function ImageWithSkeleton({ source, style }: { source: any; style: any }) {
	const [isLoading, setIsLoading] = React.useState(true);
	const opacity = useSharedValue(0.5);

	React.useEffect(() => {
		opacity.value = withRepeat(
			withSequence(
				withTiming(1, { duration: 500 }),
				withTiming(0.5, { duration: 500 })
			),
			-1,
			true
		);
	}, []);

	const skeletonStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	return (
		<View style={[style, { backgroundColor: '#F3F4F6' }]}>
			{isLoading && (
				<Animated.View
					style={[
						{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: '#E5E7EB',
						},
						skeletonStyle,
					]}
				/>
			)}
			<Image
				source={source}
				style={[style, { position: 'absolute' }]}
				resizeMode="cover"
				onLoadEnd={() => setIsLoading(false)}
			/>
		</View>
	);
}

function HomeCarousel() {
	const ref = React.useRef<ICarouselInstance>(null);
	const progress = useSharedValue<number>(0);

	const onPressPagination = (index: number) => {
		ref.current?.scrollTo({
			count: index - progress.value,
			animated: true,
		});
	};

	// Calculate dimensions for better aspect ratio
	const CAROUSEL_HEIGHT = height * 0.45;
	const ITEM_WIDTH = width * 0.95;
	const ITEM_HEIGHT = CAROUSEL_HEIGHT * 0.9;

	return (
		<View className="mb-4 -translate-y-14">
			<Carousel
				ref={ref}
				loop
				width={width}
				height={CAROUSEL_HEIGHT}
				autoPlay={true}
				autoPlayInterval={3000}
				data={Object.values(galleryImages)}
				scrollAnimationDuration={1000}
				onProgressChange={progress}
				mode="parallax"
				modeConfig={{
					parallaxScrollingScale: 0.9,
					parallaxScrollingOffset: 50,
				}}
				renderItem={({ item, index }) => (
					<View
						className="items-center justify-center"
						style={{
							width: ITEM_WIDTH,
							height: ITEM_HEIGHT,
						}}
					>
						<View className="w-full h-full rounded-2xl overflow-hidden shadow-lg bg-white">
							<ImageWithSkeleton
								source={item}
								style={{
									width: '100%',
									height: '100%',
								}}
							/>
						</View>
					</View>
				)}
			/>

			{/* <Pagination.Basic<{ color: string }>
				progress={progress}
				data={galleryImages}
				renderItem={() => (
					<View
						style={{
							borderRadius: 100,
							width: 20,
							height: 20,
						}}
					/>
				)}
				dotStyle={{
					backgroundColor: "#bbb",
					borderRadius: 100,
					width: 20,
				}}
				activeDotStyle={{
					borderRadius: 100,
					overflow: "hidden",
					backgroundColor: "#7054BE",
				}}
				containerStyle={[
					{
						gap: 5,
						marginBottom: 10,
					},
				]}
				horizontal
				onPress={onPressPagination}
			/> */}
		</View>
	);
}

export default HomeCarousel;
