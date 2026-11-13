// Les thèmes du jeu, dans les deux langues.
//
// - `id` : identifiant du thème (il sert de clé dans answers.js).
// - `pack` et `text` : ce que le joueur voit, en anglais (en) et en français (fr).
//
// Les réponses acceptées et leurs 5 raretés sont dans answers.js : un thème n'est proposé
// en partie que s'il a une liste là-bas.

export const PROMPTS = [
  {
    id: "french-empire",
    pack: { en: "Geography", fr: "Géographie" },
    text: {
      en: "Name countries that were once part of the French colonial empire",
      fr: "Cite des pays ayant fait partie de l'empire colonial français",
    },
  },
  {
    id: "champions-league",
    pack: { en: "Sport", fr: "Sport" },
    text: {
      en: "Name clubs that have won the Champions League",
      fr: "Cite des clubs ayant gagné la Ligue des champions",
    },
  },
  {
    id: "ballon-dor",
    pack: { en: "Sport", fr: "Sport" },
    text: {
      en: "Name men's players who have won the Ballon d'Or",
      fr: "Cite des joueurs ayant gagné le Ballon d'or masculin",
    },
  },
  {
    id: "world-cup-hosts",
    pack: { en: "Sport", fr: "Sport" },
    text: {
      en: "Name countries that have hosted the men's FIFA World Cup",
      fr: "Cite des pays ayant accueilli la Coupe du monde masculine de la FIFA",
    },
  },
  {
    id: "olympic-host-cities",
    pack: { en: "Sport", fr: "Sport" },
    text: {
      en: "Name cities that have hosted the Olympic Games (Summer or Winter)",
      fr: "Cite des villes ayant accueilli les Jeux olympiques (d'été ou d'hiver)",
    },
  },
  {
    id: "periodic-table",
    pack: { en: "Science", fr: "Science" },
    text: {
      en: "Name elements from the periodic table",
      fr: "Cite des éléments du tableau périodique",
    },
  },
  {
    id: "population-50m",
    pack: { en: "Geography", fr: "Géographie" },
    text: {
      en: "Name countries with more than 50 million inhabitants",
      fr: "Cite des pays qui ont plus de 50 millions d'habitants",
    },
  },
  {
    id: "british-empire",
    pack: { en: "Geography", fr: "Géographie" },
    text: {
      en: "Name countries that were once part of the British Empire",
      fr: "Cite des pays ayant fait partie de l'empire colonial britannique",
    },
  },
  {
    id: "pokemon-starters",
    pack: { en: "Video Games", fr: "Jeux Vidéos" },
    text: {
      en: "Name Pokémon starters",
      fr: "Cite des starters Pokémon",
    },
  },
  {
    id: "car-brands",
    pack: { en: "General knowledge", fr: "Culture générale" },
    text: {
      en: "Name car brands",
      fr: "Cite des marques de voiture",
    },
  },
  {
    id: "dog-breeds",
    pack: { en: "Animals", fr: "Animaux" },
    text: {
      en: "Name dog breeds",
      fr: "Cite des races de chien",
    },
  },
  {
    id: "birds",
    pack: { en: "Animals", fr: "Animaux" },
    text: {
      en: "Name birds",
      fr: "Cite des oiseaux",
    },
  },
  {
    id: "reptiles",
    pack: { en: "Animals", fr: "Animaux" },
    text: {
      en: "Name reptiles",
      fr: "Cite des reptiles",
    },
  },
  {
    id: "marine-animals",
    pack: { en: "Animals", fr: "Animaux" },
    text: {
      en: "Name marine animals",
      fr: "Cite des animaux marins",
    },
  },
  {
    id: "dinosaurs",
    pack: { en: "Animals", fr: "Animaux" },
    text: {
      en: "Name dinosaurs",
      fr: "Cite des dinosaures",
    },
  },
  {
    id: "diseases",
    pack: { en: "Health", fr: "Santé" },
    text: {
      en: "Name diseases",
      fr: "Cite des maladies",
    },
  },
  {
    id: "nintendo-games",
    pack: { en: "Video Games", fr: "Jeux Vidéos" },
    text: {
      en: "Name Nintendo games",
      fr: "Cite des jeux Nintendo",
    },
  },
  {
    id: "minecraft-mobs",
    pack: { en: "Video Games", fr: "Jeux Vidéos" },
    text: {
      en: "Name Minecraft mobs",
      fr: "Cite des mobs Minecraft",
    },
  },
  {
    id: "legendary-pokemon",
    pack: { en: "Video Games", fr: "Jeux Vidéos" },
    text: {
      en: "Name Legendary or Mythical Pokémon",
      fr: "Cite des Pokémon légendaires ou fabuleux.",
    },
  },
  {
    id: "rhythm-games",
    pack: { en: "Video Games", fr: "Jeux Vidéos" },
    text: {
      en: "Name rhythm games",
      fr: "Cite des jeux de rythme",
    },
  },
  {
    id: "tower-defense",
    pack: { en: "Video Games", fr: "Jeux Vidéos" },
    text: {
      en: "Name tower defense games",
      fr: "Cite des tower defense",
    },
  },
  {
    id: "fps-games",
    pack: { en: "Video Games", fr: "Jeux Vidéos" },
    text: {
      en: "Name FPS games",
      fr: "Cite des FPS",
    },
  },
  {
    id: "tps-games",
    pack: { en: "Video Games", fr: "Jeux Vidéos" },
    text: {
      en: "Name TPS games",
      fr: "Cite des TPS",
    },
  },
  {
    id: "programming-languages",
    pack: { en: "Technology", fr: "Technologie" },
    text: {
      en: "Name programming or markup languages",
      fr: "Cite des langages de programmation ou de balisage",
    },
  },
  {
    id: "web-browsers",
    pack: { en: "Technology", fr: "Technologie" },
    text: {
      en: "Name web browsers",
      fr: "Cite des navigateurs web",
    },
  },
  {
    id: "pasta-types",
    pack: { en: "Food", fr: "Cuisine" },
    text: {
      en: "Name types of pasta",
      fr: "Cite des types de pâtes",
    },
  },
  {
    id: "cheeses",
    pack: { en: "Food", fr: "Cuisine" },
    text: {
      en: "Name cheeses",
      fr: "Cite des fromages",
    },
  },
  {
    id: "alcohols",
    pack: { en: "Food", fr: "Cuisine" },
    text: {
      en: "Name alcoholic drinks",
      fr: "Cite des alcools",
    },
  },
  {
    id: "gacha-games",
    pack: { en: "Video Games", fr: "Jeux Vidéos" },
    text: {
      en: "Name gacha games",
      fr: "Cite des jeux gacha",
    },
  },
  {
    id: "spanish-speaking",
    pack: { en: "Geography", fr: "Géographie" },
    text: {
      en: "Name countries where Spanish is spoken",
      fr: "Cite des pays qui parlent espagnol",
    },
  },
  {
    id: "landlocked-countries",
    pack: { en: "Geography", fr: "Géographie" },
    text: {
      en: "Name landlocked countries",
      fr: "Cite des pays enclavés",
    },
  },
  {
    id: "island-countries",
    pack: { en: "Geography", fr: "Géographie" },
    text: {
      en: "Name island countries (not connected to a continent)",
      fr: "Cite des pays insulaires (non reliés à un continent)",
    },
  },
  {
    id: "flowers",
    pack: { en: "Nature", fr: "Nature" },
    text: {
      en: "Name flowers",
      fr: "Cite des fleurs",
    },
  },
];
