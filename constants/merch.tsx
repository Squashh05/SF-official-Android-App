import Ionicons from "@expo/vector-icons/Ionicons";

const merchandises = [
	{
		id: 1,
		frontImage: require("@/assets/images/merch/tshirt-front.png"),
		backImage: require("@/assets/images/merch/tshirt-rolling.png"),
		title: "With The Waves",
		subtitle: "T Shirt",
		description:
			"Unleash your inner dynamism with the Rolling T-Shirt. Crafted for comfort and style, this tee features a unique rolling-inspired design that keeps you effortlessly cool. Perfect for casual outings, it's a must-have for those who like to keep it rolling.",
		price: 499,
		category: "tshirt",
	},
	{
		id: 2,
		frontImage: require("@/assets/images/merch/tshirt-front.png"),
		backImage: require("@/assets/images/merch/tshirt-witch.png"),
		title: "Weaver of Spells",
		subtitle: "T Shirt",
		description:
			"Embrace the magic with the Witch T-Shirt. Designed with a bewitching graphic, this tee combines comfort and charm to make a spellbinding addition to your wardrobe. Whether it's for a casual hangout or a magical evening, this shirt is your perfect companion.",
		price: 499,
		category: "tshirt",
	},
	{
		id: 3,
		frontImage: require("@/assets/images/merch/hoodie-front.png"),
		backImage: require("@/assets/images/merch/hoodie-oldman.png"),
		title: "Old Man Hoodie",
		subtitle: "Hoodie",
		description:
			"Channel timeless wisdom and style with the Old Man Hoodie. Featuring a thoughtful design and unmatched coziness, this hoodie is perfect for chilly days or relaxed evenings. Make a bold, vintage-inspired statement that never goes out of fashion.",
		price: 999,
		category: "hoodie",
	},
	{
		id: 4,
		frontImage: require("@/assets/images/merch/hoodie-front.png"),
		backImage: require("@/assets/images/merch/hoodie-mask.png"),
		title: "Unmask The Mystery",
		subtitle: "Hoodie",
		description:
			"Step into a world of mystique with the Carnival Mask Hoodie. Boasting a vibrant and enigmatic mask design, this hoodie adds a festive flair to your wardrobe. Stay warm, look cool, and let your style shine.",
		price: 999,
		category: "hoodie",
	},
];

const categories = [
	{
		title: "All",
		image: require("@/assets/icons/all.png"),
	},
	{
		title: "T Shirts",
		icon: <Ionicons name="shirt-outline" size={32} color="white" />,
	},
	{
		title: "Hoodies",
		image: require("@/assets/icons/hoodie.png"),
	},
];

const sizes = [
	{
		S: ["S", "26", "40"],
	},
	{
		M: ["M", "27", "42"],
	},
	{
		L: ["L", "28", "44"],
	},
	{
		XL: ["XL", "29", "46"],
	},
	{
		XXL: ["XXL", "30", "48"],
	},
] as {
	[key: string]: string[];
}[];

const merchandisesInCategory: { [key: string]: number[] } = {
	All: [0, 1, 2, 3],
	"T Shirts": [0, 1],
	Hoodies: [2, 3],
};

export { merchandises, categories, merchandisesInCategory, sizes };
