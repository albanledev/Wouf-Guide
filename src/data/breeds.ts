import { BreedCatalogSchema, type Breed } from "@/domain/breed.schema";

const RAW_BREEDS: Breed[] = [
  {
    slug: "golden-retriever",
    name: "Golden Retriever",
    tagline: "Le meilleur pote qui repeint votre canapé en blond.",
    summary:
      "Grand classique des familles, le Golden Retriever est un chien solaire et ultra coopératif. Sous ses airs de peluche, il reste un chien de chasse d'eau enthousiaste qui réclame de vraies sorties et adore la boue.",
    origin: "Écosse",
    size: "large",
    weightKg: { min: 25, max: 34 },
    lifespanYears: { min: 10, max: 12 },
    budgetLevel: 3,
    scores: {
      energy: 4,
      apartment: 2,
      family: 5,
      aloneTime: 2,
      grooming: 1,
      trainability: 5,
    },
    pros: [
      "Patience remarquable avec les enfants et les invités, même quand la maison est animée.",
      "Ultra motivé par la nourriture, ce qui rend l'éducation fluide dès les premiers mois.",
      "Très sociable avec les humains et la majorité des autres chiens croisés au parc.",
      "Adore les jeux de rapport et la baignade, facile à impliquer dans les activités familiales.",
    ],
    cons: [
      "Perd d'importantes quantités de sous-poil toute l'année, aspirateur quotidien quasi obligatoire.",
      "Plonge dans chaque flaque ou étang croisé, impliquant rinçage et séchage de 30 kg de chien.",
      "Supporte mal les longues journées seul : passé 4 à 5 heures, il peut couiner ou mâchouiller.",
      "Budget croquettes et suivi articulaire ou auriculaire (otites fréquentes) à anticiper.",
    ],
    idealFor:
      "Foyer présent et actif qui aime marcher par tous les temps, accepte les poils partout et cherche un chien complice.",
    avoidIf:
      "Personne absente 9h par jour en appartement, maniaque du canapé impeccable ou cherchant un chien de garde.",
    imagePath: "/images/breeds/golden-retriever.png",
    imageAlt: "Portrait illustré d'un Golden Retriever souriant au pelage doré",
  },
  {
    slug: "bouledogue-francais",
    name: "Bouledogue Français",
    tagline: "Un clown ronfleur taillé pour le canapé et les petits trajets.",
    summary:
      "Compact, drôle et très expressif, le Bouledogue Français s'adapte facilement à la vie citadine sans réclamer des marathons. En contrepartie, son museau écrasé impose une vraie vigilance sur la chaleur et le budget vétérinaire.",
    origin: "France",
    size: "small",
    weightKg: { min: 8, max: 14 },
    lifespanYears: { min: 10, max: 12 },
    budgetLevel: 3,
    scores: {
      energy: 2,
      apartment: 5,
      family: 4,
      aloneTime: 3,
      grooming: 4,
      trainability: 3,
    },
    pros: [
      "Parfaitement à l'aise en appartement avec 30 à 45 minutes de balades calmes par jour.",
      "Aboie très peu au quotidien, un vrai plus pour la tranquillité des voisins.",
      "Poil court qui demande peu de brossage, juste un nettoyage régulier des plis du visage.",
    ],
    cons: [
      "Supporte très mal la chaleur et l'effort intense à cause de sa face plate (risque de coup de chaleur).",
      "Ronflements sonores, bruits respiratoires et flatulences font partie du quotidien.",
      "Factures vétérinaires souvent élevées (respiration, allergies cutanées, dos fragile).",
    ],
    idealFor:
      "Citadin ou famille calme en appartement cherchant un compagnon drôle, câlin et peu sportif.",
    avoidIf:
      "Coureur à pied, amateur de randonnées estivales ou budget santé serré sans mutuelle animale.",
    imagePath: "/images/breeds/bouledogue-francais.png",
    imageAlt: "Portrait illustré d'un Bouledogue Français fauve aux grandes oreilles droites",
  },
  {
    slug: "berger-australien",
    name: "Berger Australien",
    tagline: "Un génie hyperactif qui a besoin d'un vrai métier.",
    summary:
      "Magnifique et brillant, le Berger Australien séduit par son regard perçant et sa complicité fusionnelle. Mais c'est un vrai chien de travail : sans 1h30 à 2h de dépense physique et mentale quotidienne, il invente ses propres bêtises.",
    origin: "États-Unis",
    size: "medium",
    weightKg: { min: 18, max: 29 },
    lifespanYears: { min: 12, max: 15 },
    budgetLevel: 2,
    scores: {
      energy: 5,
      apartment: 2,
      family: 4,
      aloneTime: 2,
      grooming: 2,
      trainability: 5,
    },
    pros: [
      "Apprend de nouveaux tours et ordres en quelques répétitions, idéal pour l'agility ou le cani-cross.",
      "Très proche de ses humains, il crée une relation de complicité intense et fidèle.",
      "Chien robuste et endurant capable de suivre toutes les aventures en pleine nature.",
    ],
    cons: [
      "Demande au moins 1h30 à 2h de sorties actives et de jeux de réflexion chaque jour, pluie ou soleil.",
      "Peut pincer les talons des enfants ou courir après les vélos par instinct de troupeau mal canalisé.",
      "S'il s'ennuie ou reste trop seul, il développe vite destruction, aboiements ou hyperactivité.",
    ],
    idealFor:
      "Maître sportif et disponible, prêt à s'investir dans l'éducation, la randonnée ou un sport canin.",
    avoidIf:
      "Foyer sédentaire qui espère se contenter d'un petit tour du pâté de maisons ou d'un jardin sans sorties.",
    imagePath: "/images/breeds/berger-australien.png",
    imageAlt: "Portrait illustré d'un Berger Australien bleu merle au regard vif",
  },
  {
    slug: "cavalier-king-charles",
    name: "Cavalier King Charles",
    tagline: "La douceur incarnée, avec option pot-de-colle permanent.",
    summary:
      "Chien de compagnie par excellence, le Cavalier King Charles combine gentillesse désarmante, format pratique et facilité d'éducation. Son vrai point faible : il déteste la solitude et demande un suivi cardiaque rigoureux.",
    origin: "Royaume-Uni",
    size: "small",
    weightKg: { min: 5, max: 8 },
    lifespanYears: { min: 10, max: 14 },
    budgetLevel: 3,
    scores: {
      energy: 2,
      apartment: 5,
      family: 5,
      aloneTime: 1,
      grooming: 2,
      trainability: 4,
    },
    pros: [
      "D'une gentillesse constante avec les enfants, les personnes âgées et les autres animaux.",
      "Très facile à éduquer même pour un premier chien, sans rapport de force.",
      "Format compact facile à emmener partout (train, vacances, cafés).",
    ],
    cons: [
      "Supporte très mal de rester seul : l'anxiété de séparation apparaît vite si le foyer s'absente toute la journée.",
      "Prédispositions génétiques sérieuses (maladie cardiaque MVD) imposant un élevage irréprochable et un suivi véto.",
      "Ses longues oreilles soyeuses s'emmêlent vite et trempent dans les gamelles sans brossage régulier.",
    ],
    idealFor:
      "Personne en télétravail, retraité actif ou famille douce très présente au quotidien.",
    avoidIf:
      "Célibataire absent au bureau 8 à 10 heures par jour ou personne ne voulant pas surveiller la santé cardiaque.",
    imagePath: "/images/breeds/cavalier-king-charles.png",
    imageAlt: "Portrait illustré d'un Cavalier King Charles Blenheim aux longues oreilles soyeuses",
  },
  {
    slug: "shiba-inu",
    name: "Shiba Inu",
    tagline: "Un chat dans un corps de petit renard très sûr de lui.",
    summary:
      "Propre, indépendant et incroyablement photogénique, le Shiba Inu n'a rien d'un chien soumis qui obéit au doigt et à l'œil. Il négocie chaque ordre, déteste la contrainte et peut faire entendre son fameux « cri du Shiba ».",
    origin: "Japon",
    size: "medium",
    weightKg: { min: 8, max: 12 },
    lifespanYears: { min: 12, max: 15 },
    budgetLevel: 2,
    scores: {
      energy: 3,
      apartment: 4,
      family: 3,
      aloneTime: 4,
      grooming: 3,
      trainability: 2,
    },
    pros: [
      "Gère beaucoup mieux la solitude que la moyenne des chiens, sans dépendance excessive.",
      "Naturellement très propre (presque comme un chat) et aboie rarement sans raison.",
      "Santé généralement robuste et gabarit pratique autant en ville qu'en balade nature.",
    ],
    cons: [
      "Très indépendant et têtu : le rappel sans laisse reste souvent risqué à cause de son instinct de chasse.",
      "Deux mues saisonnières spectaculaires où son sous-poil tombe par touffes entières.",
      "Peu démonstratif et parfois sélectif avec les chiens du même sexe ou les inconnus trop insistants.",
    ],
    idealFor:
      "Maître patient et respectueux de son indépendance, qui aime son caractère entier et utilise une éducation positive.",
    avoidIf:
      "Débutant qui rêve d'un chien collant, obéissant au quart de tour et lâché librement partout.",
    imagePath: "/images/breeds/shiba-inu.png",
    imageAlt: "Portrait illustré d'un Shiba Inu roux au sourire malicieux",
  },
  {
    slug: "beagle",
    name: "Beagle",
    tagline: "Une truffe sur pattes au cœur en or et à l'estomac sans fond.",
    summary:
      "Joyeux, solide et toujours partant pour l'aventure, le Beagle est un merveilleux compagnon familial. Mais son flair surpuissant prend vite le dessus sur ses oreilles : dès qu'une piste ou un sandwich passe, il n'écoute plus rien.",
    origin: "Royaume-Uni",
    size: "medium",
    weightKg: { min: 10, max: 16 },
    lifespanYears: { min: 12, max: 15 },
    budgetLevel: 2,
    scores: {
      energy: 4,
      apartment: 3,
      family: 5,
      aloneTime: 2,
      grooming: 4,
      trainability: 2,
    },
    pros: [
      "Tempérament joyeux, joueur et infatigable avec les enfants, zéro rancune.",
      "Entretien du poil court très simple et santé globalement robuste.",
      "Très sociable avec les autres chiens grâce à son passé de chien de meute.",
    ],
    cons: [
      "Fugueur dès qu'il capte une piste intéressante : jardin parfaitement clôturé et longe recommandés.",
      "Glouton redoutable prêt à ouvrir placards et poubelles, sujet au surpoids si on cède.",
      "Voix puissante et caractéristique (hurlement de meute) qui peut poser souci en appartement s'il reste seul.",
    ],
    idealFor:
      "Famille active et bien clôturée qui aime les grandes balades en forêt et ne manque pas d'humour.",
    avoidIf:
      "Personne en appartement avec voisins sensibles au bruit ou laissant de la nourriture à portée.",
    imagePath: "/images/breeds/beagle.png",
    imageAlt: "Portrait illustré d'un Beagle tricolore aux oreilles tombantes",
  },
  {
    slug: "border-collie",
    name: "Border Collie",
    tagline: "Le premier de la classe qui corrige vos fautes d'inattention.",
    summary:
      "Considéré comme la race la plus vive d'esprit, le Border Collie anticipe vos gestes avant même que vous ne parliez. C'est un athlète de travail qui devient vite anxieux ou obsessionnel s'il n'a pas une stimulation quotidienne intense.",
    origin: "Écosse",
    size: "medium",
    weightKg: { min: 14, max: 22 },
    lifespanYears: { min: 12, max: 15 },
    budgetLevel: 2,
    scores: {
      energy: 5,
      apartment: 1,
      family: 3,
      aloneTime: 2,
      grooming: 3,
      trainability: 5,
    },
    pros: [
      "Capacité d'apprentissage hors norme : obéissance, frisbee, agility ou recherche utilitaire, il excelle partout.",
      "Dévoué et ultra attentif à son humain, toujours prêt à coopérer dans l'action.",
      "Endurance impressionnante pour les grands marcheurs et sportifs quotidiens.",
    ],
    cons: [
      "Un simple jardin ne suffit absolument pas : sans stimulation mentale quotidienne, il développe des TOCs (ombres, voitures).",
      "Très sensible à son environnement, il peut vite stresser en centre-ville bruyant ou dans un petit appartement.",
      "Instinct de poursuite très fort face aux joggeurs, vélos ou enfants qui courent.",
    ],
    idealFor:
      "Sportif passionné d'éducation canine vivant près de grands espaces et prêt à consacrer 2h par jour à son chien.",
    avoidIf:
      "Premier chien en appartement ou foyer cherchant un compagnon tranquille qui dort toute la journée.",
    imagePath: "/images/breeds/border-collie.png",
    imageAlt: "Portrait illustré d'un Border Collie noir et blanc au regard attentif",
  },
  {
    slug: "teckel",
    name: "Teckel",
    tagline: "Un grand chien de chasse compressé en format saucisse.",
    summary:
      "Derrière sa silhouette amusante se cache un vrai terrier de chasse courageux, malin et doté d'une forte personnalité. Le Teckel vit très bien en appartement à condition de protéger son dos long et d'accepter son côté têtu.",
    origin: "Allemagne",
    size: "small",
    weightKg: { min: 5, max: 10 },
    lifespanYears: { min: 12, max: 16 },
    budgetLevel: 2,
    scores: {
      energy: 3,
      apartment: 4,
      family: 3,
      aloneTime: 4,
      grooming: 4,
      trainability: 2,
    },
    pros: [
      "Gabarit compact facile à loger en appartement et longévité souvent supérieure à 13 ans.",
      "Personnalité attachante, drôle et courageuse, toujours prêt pour de vraies balades.",
      "Gère correctement la solitude une fois bien habitué, et demande peu de toilettage en poil ras.",
    ],
    cons: [
      "Colonne vertébrale fragile (risque de hernie discale) : il faut limiter les escaliers et les sauts du canapé.",
      "Caractère bien trempé et instinct de creuser : l'éducation demande constance et patience.",
      "Peut aboyer pour alerter au moindre bruit dans le couloir et se montrer méfiant avec les inconnus.",
    ],
    idealFor:
      "Foyer de plain-pied ou avec ascenseur qui aime les chiens de caractère dans un petit format.",
    avoidIf:
      "Appartement au 4e étage sans ascenseur ou jeunes enfants trop brusques dans leurs manipulations.",
    imagePath: "/images/breeds/teckel.png",
    imageAlt: "Portrait illustré d'un Teckel à poil ras acajou aux longues oreilles",
  },
  {
    slug: "husky-siberien",
    name: "Husky Sibérien",
    tagline: "Un coureur de fond qui commente votre vie en hurlant.",
    summary:
      "Fascinant avec son allure de loup, le Husky Sibérien a été sélectionné pour courir des dizaines de kilomètres en meute. C'est un chien indépendant, fugueur et bavard qui demande un mode de vie sportif bien plus que de jolis yeux bleus.",
    origin: "Sibérie",
    size: "large",
    weightKg: { min: 16, max: 27 },
    lifespanYears: { min: 12, max: 14 },
    budgetLevel: 3,
    scores: {
      energy: 5,
      apartment: 1,
      family: 4,
      aloneTime: 2,
      grooming: 1,
      trainability: 2,
    },
    pros: [
      "Partenaire incroyable pour le cani-cross, le VTT attelé ou les longues randonnées sportives.",
      "Généralement doux et dépourvu d'agressivité envers les humains, même les étrangers.",
      "Chien rustique et peu odorant qui supporte très bien le froid.",
    ],
    cons: [
      "Mue titanesque deux fois par an : des nuages de sous-poil recouvrent littéralement la maison.",
      "Maître de l'évasion (saute haut, creuse vite) et rappel quasi impossible face au gibier ou aux chats.",
      "Vocalise beaucoup par des hurlements longs s'il s'ennuie ou reste seul, redoutable pour le voisinage.",
    ],
    idealFor:
      "Sportif d'endurance avec maison très solidement clôturée et connaissance des chiens nordiques.",
    avoidIf:
      "Appartement urbain, foyer avec petits animaux libres ou adoption motivée uniquement par son look.",
    imagePath: "/images/breeds/husky-siberien.png",
    imageAlt: "Portrait illustré d'un Husky Sibérien gris et blanc aux yeux bleu glacier",
  },
  {
    slug: "cocker-spaniel-anglais",
    name: "Cocker Spaniel Anglais",
    tagline: "Une boule de joie aux oreilles soyeuses et au flair infatigable.",
    summary:
      "Toujours la queue en mouvement, le Cocker Spaniel Anglais déborde d'enthousiasme et d'affection. Ce chien de chasse joyeux a besoin de vraies balades stimulantes et d'un entretien attentif de son pelage et de ses oreilles.",
    origin: "Royaume-Uni",
    size: "medium",
    weightKg: { min: 12, max: 15 },
    lifespanYears: { min: 12, max: 15 },
    budgetLevel: 2,
    scores: {
      energy: 4,
      apartment: 3,
      family: 5,
      aloneTime: 2,
      grooming: 2,
      trainability: 4,
    },
    pros: [
      "Tempérament gai, expressif et très complice avec toute la famille.",
      "Gabarit intermédiaire idéal : assez robuste pour randonner, assez compact pour voyager facilement.",
      "Répond très bien à une éducation douce et cohérente grâce à sa grande gourmandise.",
    ],
    cons: [
      "Ses longues oreilles lourdes retiennent humidité et épillets : nettoyage fréquent indispensable contre les otites.",
      "Pelage soyeux qui accroche ronces et boue, demandant brossage régulier et toilettage périodique.",
      "Très gourmand et attaché à ses maîtres : tendance à l'embonpoint et malheureux s'il est isolé.",
    ],
    idealFor:
      "Famille active prête à consacrer du temps aux promenades quotidiennes et au brossage hebdomadaire.",
    avoidIf:
      "Personne qui ne veut aucun entretien du pelage ou qui sort son chien seulement 20 minutes par jour.",
    imagePath: "/images/breeds/cocker-spaniel-anglais.png",
    imageAlt: "Portrait illustré d'un Cocker Spaniel Anglais doré aux longues oreilles ondulées",
  },
  {
    slug: "bichon-frise",
    name: "Bichon Frisé",
    tagline: "Un petit nuage joyeux qui ne laisse pas de poils sur vos pulls.",
    summary:
      "Pétillant, malin et très sociable, le Bichon Frisé est l'un des meilleurs chiens d'appartement pour débuter. Son pelage frisé ne tombe presque pas, mais exige en échange un vrai budget toilettage et beaucoup de présence humaine.",
    origin: "France / Belgique",
    size: "small",
    weightKg: { min: 3, max: 6 },
    lifespanYears: { min: 13, max: 16 },
    budgetLevel: 2,
    scores: {
      energy: 2,
      apartment: 5,
      family: 5,
      aloneTime: 1,
      grooming: 1,
      trainability: 4,
    },
    pros: [
      "Perd quasiment aucun poil dans la maison, un énorme atout pour garder un intérieur propre.",
      "Humeur joyeuse et sociable avec les enfants, les inconnus et les autres animaux.",
      "S'épanouit pleinement en appartement avec des balades modérées et des jeux à la maison.",
    ],
    cons: [
      "Toilettage professionnel toutes les 6 à 8 semaines et brossage quasi quotidien pour éviter les nœuds serrés.",
      "Très dépendant affectivement : supporte difficilement de rester seul toute une journée de travail.",
      "Apprentissage de la propreté parfois plus long chez le chiot si on manque de régularité.",
    ],
    idealFor:
      "Foyer présent en appartement cherchant un petit chien gai, sociable et qui ne sème pas de poils.",
    avoidIf:
      "Personne souvent absente ou refusant le temps et le coût d'un toilettage professionnel régulier.",
    imagePath: "/images/breeds/bichon-frise.png",
    imageAlt: "Portrait illustré d'un Bichon Frisé blanc au pelage bouclé et joyeux",
  },
  {
    slug: "labrador-retriever",
    name: "Labrador Retriever",
    tagline: "Un cœur géant dans un corps de bulldozer gourmand.",
    summary:
      "Chien de famille iconique, le Labrador Retriever séduit par sa bonhomie, son intelligence pratique et son poil court facile à vivre. Attention toutefois à ses deux premières années ultra fougueuses et à son appétit légendaire.",
    origin: "Canada / Royaume-Uni",
    size: "large",
    weightKg: { min: 27, max: 36 },
    lifespanYears: { min: 10, max: 13 },
    budgetLevel: 3,
    scores: {
      energy: 4,
      apartment: 2,
      family: 5,
      aloneTime: 2,
      grooming: 3,
      trainability: 5,
    },
    pros: [
      "Équilibre émotionnel exceptionnel avec les enfants et grande facilité d'éducation.",
      "Poil court et dense beaucoup plus simple à nettoyer que celui du Golden Retriever.",
      "Toujours motivé pour les balades, la nage ou les jeux en plein air, zéro mauvaise humeur.",
    ],
    cons: [
      "Jeunesse très physique (jusqu'à 2 ans) : tire fort en laisse, bouscule par enthousiasme et mâchouille tout.",
      "Appétit insatiable avec forte prédisposition au surpoids (rationnement strict indispensable).",
      "Mue tout de même nettement au printemps et à l'automne, et supporte mal l'ennui en solitude prolongée.",
    ],
    idealFor:
      "Famille dynamique qui veut un grand chien affectueux, facile à éduquer et prêt à partager toutes ses sorties.",
    avoidIf:
      "Petit appartement sans temps de sortie quotidien ou personne qui cède facilement aux yeux doux à table.",
    imagePath: "/images/breeds/labrador-retriever.png",
    imageAlt: "Portrait illustré d'un Labrador Retriever chocolat au grand sourire amical",
  },
];

export const BREEDS: readonly Breed[] = BreedCatalogSchema.parse(RAW_BREEDS);
