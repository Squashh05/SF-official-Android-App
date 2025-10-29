type CategoryImagesType = {
	[key: string]: any;
};

export const categoryImages = {
	Dance: require("@/assets/Events/GenreImages/Dance.png"),
	Music: require("@/assets/Events/GenreImages/Music.png"),
	Dramatics: require("@/assets/Events/GenreImages/Dramatics.png"),
	Literary: require("@/assets/Events/GenreImages/Literary.png"),
	"Film Fest": require("@/assets/Events/GenreImages/FilmFest.png"),
	Quiz: require("@/assets/Events/GenreImages/Quiz.png"),
	"Fine Arts": require("@/assets/Events/GenreImages/FineArts.png"),
	"Culinary Arts": require("@/assets/Events/GenreImages/CulinaryArts.png"),
	Fashion: require("@/assets/Events/GenreImages/Fashion.png"),
	"Game Fest": require("@/assets/Events/GenreImages/GameFest.png"),
	"Humor Fest": require("@/assets/Events/GenreImages/HumorFest.png"),
} as CategoryImagesType;

type EventImagesType = {
	[key: string]: any;
};

export const eventImages = {
	// Dance events
	DanceCentrifuge: require("@/assets/Events/Dance/Centrifuge.png"),
	DanceNrityakala: require("@/assets/Events/Dance/Nrityakala.png"),
	DanceShakeALeg: require("@/assets/Events/Dance/ShakeALeg.png"),
	DanceShuffle: require("@/assets/Events/Dance/Shuffle.png"),
	DanceShuffleSolo: require("@/assets/Events/Dance/Shuffle.png"),
	DanceShuffleTeam: require("@/assets/Events/Dance/Shuffle.png"),
	DanceTwoForATango: require("@/assets/Events/Dance/TwoForATango.png"),

	// Music events
	MusicCanYouDuet: require("@/assets/Events/Music/CanYouDuet.png"),
	MusicBeatIT: require("@/assets/Events/Music/BeatIT.png"),
	MusicLakesideDreamsGroup: require("@/assets/Events/Music/LakesideDreamsGroup.png"),
	MusicLakesideDreamsSolo: require("@/assets/Events/Music/LakesideDreamsSolo.png"),
	MusicLakesideDreams: require("@/assets/Events/Music/LakesideDreamsSolo.png"),
	MusicNotesLessTravelled: require("@/assets/Events/Music/NotesLessTravelled.png"),
	MusicRapmania: require("@/assets/Events/Music/Rapmania.png"),
	MusicRetrowave: require("@/assets/Events/Music/Retrowave.png"),
	MusicSargam: require("@/assets/Events/Music/Sargam.png"),
	MusicSFIdol: require("@/assets/Events/Music/SFIdol.png"),
	MusicWarOfTheDJs: require("@/assets/Events/Music/WarOfTheDJs.png"),
	MusicWildfire: require("@/assets/Events/Music/Wildfire.png"),

	// Dramatics events
	DramaticsDumbstruck: require("@/assets/Events/Dramatics/Dumbstruck.png"),
	DramaticsIMeMyself: require("@/assets/Events/Dramatics/IMeMyself.png"),
	DramaticsNukkad: require("@/assets/Events/Dramatics/Nukkad.png"),
	DramaticsRangmanch: require("@/assets/Events/Dramatics/Rangmanch.png"),

	// Literary events
	LiteraryAMightyPen: require("@/assets/Events/Literary/AMightyPen.png"),
	LiteraryDumbC: require("@/assets/Events/Literary/DumbC.png"),
	LiteraryEnglishPoetrySlam: require("@/assets/Events/Literary/EnglishPoetrySlam.png"),
	LiteraryHindiPoetrySlam: require("@/assets/Events/Literary/HindiPoetrySlam.png"),
	LiteraryImpromptu: require("@/assets/Events/Literary/Impromptu.png"),
	LiteraryIndiaCalling: require("@/assets/Events/Literary/IndiaCalling.png"),
	LiteraryJumbleTheGoodWord: require("@/assets/Events/Literary/JumbleTheGoodWord.png"),
	LiteraryJustAMinute: require("@/assets/Events/Literary/JumbleTheGoodWord.png"),
	LiteraryMiniTale: require("@/assets/Events/Literary/JumbleTheGoodWord.png"),
	LiteraryNationalLevelDebate: require("@/assets/Events/Literary/NationalLevelDebate.png"),
	LiteraryPoetrySlam: require("@/assets/Events/Literary/EnglishPoetrySlam.png"),
	LiteraryTellATale: require("@/assets/Events/Literary/TellATale.png"),

	// Film Fest events
	FilmFestAPictureTale: require("@/assets/Events/Film Fest/APictureTale.png"),
	FilmFestFestFocus: require("@/assets/Events/Film Fest/FestFocus.png"),
	FilmFestLightsCameraSF: require("@/assets/Events/Film Fest/LightsCameraSF.png"),
	FilmFestMotionTales: require("@/assets/Events/Film Fest/MotionTales.png"),
	FilmFestSFM: require("@/assets/Events/Film Fest/SFM.png"),

	// Quiz events
	QuizBizTech: require("@/assets/Events/Quiz/BizTech.png"),
	QuizCinemania: require("@/assets/Events/Quiz/Cinemania.png"),
	QuizMaryBucknelTrophyMBT: require("@/assets/Events/Quiz/MaryBucknelTrophy.png"),
	QuizSpEnt: require("@/assets/Events/Quiz/SpEnt.png"),
	QuizOtakonQuest: require("@/assets/Events/Quiz/OtakonQuest.png"),

	// Fine Arts events
	FineArtsStrokesOnStreets: require("@/assets/Events/Fine Arts/StrokesOnStreets.png"),
	FineArtsFrenzyFabric: require("@/assets/Events/Fine Arts/FrenzyFabric.png"),
	FineArtsBranD: require("@/assets/Events/Fine Arts/Bran-D.png"),
	FineArtsDigitalIllustration: require("@/assets/Events/Fine Arts/DigitalIllustration.png"),
	FineArtsFaceCanvas: require("@/assets/Events/Fine Arts/FaceCanvas.png"),
	FineArtsFingerDab: require("@/assets/Events/Fine Arts/FingerPainting.png"),
	FineArtsJunkArt: require("@/assets/Events/Fine Arts/JunkArt.png"),
	FineArtsPaintIt: require("@/assets/Events/Fine Arts/PaintIt.png"),
	FineArtsRangoli: require("@/assets/Events/Fine Arts/Rangoli.png"),
	FineArtsSketchIt: require("@/assets/Events/Fine Arts/SketchIt.png"),
	FineArtsSoapaholic: require("@/assets/Events/Fine Arts/Soapaholic.png"),

	// Food Fest events
	CulinaryArtsChefsCorner: require("@/assets/Events/Food Fest/ChefsCorner.png"),
	CulinaryArtsFoodCarving: require("@/assets/Events/Food Fest/FoodFestTopIcon.png"),
	CulinaryArtsMixology: require("@/assets/Events/Food Fest/Mixology.png"),
	CulinaryArtsTopItToWinIt: require("@/assets/Events/Food Fest/TopItToWinIt.png"),

	// Fashion events
	FashionMrAndMsSPRINGFEST: require("@/assets/Events/Fashion/MrandMsSPRINGFEST.png"),
	FashionNavyata: require("@/assets/Events/Fashion/Navyata.png"),
	FashionPanache: require("@/assets/Events/Fashion/Panache.png"),
	FashionPeekAWho: require("@/assets/Events/Fashion/PeekAWho.png"),
	FashionStashNShow: require("@/assets/Events/Fashion/StashNShow.png"),

	// Game Fest events
	// GameFestAccommodation: require("@/assets/Events/Game Fest/Accommodation.png"),
	GameFestBGMI: require("@/assets/Events/Game Fest/BGMI.png"),
	GameFestFIFA: require("@/assets/Events/Game Fest/FIFA.png"),
	GameFestLabyrinth: require("@/assets/Events/Game Fest/Labyrinth.png"),
	GameFestValorant: require("@/assets/Events/Game Fest/Valorant.png"),

	// Humor Fest events
	HumorFestBanterBout: require("@/assets/Events/Humor Fest/BanterBout.png"),
	HumorFestHilarityEnsues: require("@/assets/Events/Humor Fest/HilarityEnsues.png"),
} as EventImagesType;

export const galleryImages = [
	require("@/assets/gallery_images/1.jpg"),
	require("@/assets/gallery_images/2.jpg"),
	require("@/assets/gallery_images/3.jpg"),
	require("@/assets/gallery_images/4.jpg"),
	require("@/assets/gallery_images/5.jpg"),
	require("@/assets/gallery_images/6.jpg"),
	require("@/assets/gallery_images/7.jpg"),
	require("@/assets/gallery_images/8.jpg"),
	require("@/assets/gallery_images/9.jpg"),
	require("@/assets/gallery_images/10.jpg"),
	require("@/assets/gallery_images/11.jpg"),
	require("@/assets/gallery_images/12.jpg"),
	require("@/assets/gallery_images/13.jpg"),
	require("@/assets/gallery_images/14.jpg"),
	require("@/assets/gallery_images/15.jpg"),
] as any[];
