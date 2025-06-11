export interface Transaction {
  id: string | number;
  date: Date;
  amount: number;
  category: string;
  action: string;
  recipient: string;
  memo: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Action {
  name: string;
}

export const ACTIONS: Action[] = [
  { name: 'Chatoyantes 2025' },
  { name: 'EFG 2025' },
];

export const CATEGORIES: Category[] = [
  // CLASSE 6 - CHARGES (Expenses/Outflows)
  // Achats (Purchases)
  { id: 'achats-matieres-premieres', name: 'Achats matières premières' },
  { id: 'achats-marchandises', name: 'Achats marchandises' },
  { id: 'achats-fournitures-bureau', name: 'Fournitures de bureau' },
  { id: 'achats-combustibles-carburants', name: 'Combustibles et carburants' },
  { id: 'achats-produits-entretien', name: "Produits d'entretien" },
  { id: 'achats-fournitures-diverses', name: 'Fournitures diverses' },

  // Services extérieurs (External services)
  { id: 'locations-immobilieres', name: 'Locations immobilières' },
  { id: 'locations-materiels', name: 'Locations de matériels' },
  { id: 'entretien-reparations', name: 'Entretien et réparations' },
  { id: 'assurances', name: 'Assurances' },
  { id: 'documentation-formation', name: 'Documentation et formation' },
  { id: 'honoraires-experts', name: "Honoraires d'experts" },
  { id: 'publicite-communication', name: 'Publicité et communication' },
  {
    id: 'frais-postaux-telecommunications',
    name: 'Frais postaux et télécommunications',
  },
  { id: 'transports-deplacements', name: 'Transports et déplacements' },
  { id: 'missions-receptions', name: 'Missions et réceptions' },
  { id: 'services-bancaires', name: 'Services bancaires' },
  { id: 'autres-services-exterieurs', name: 'Autres services extérieurs' },

  // Impôts et taxes (Taxes)
  { id: 'impots-taxes', name: 'Impôts et taxes' },
  { id: 'contributions-sociales', name: 'Contributions sociales' },
  { id: 'taxes-formation', name: 'Taxes sur la formation' },

  // Charges de personnel (Personnel costs)
  { id: 'salaires-traitements', name: 'Salaires et traitements' },
  { id: 'charges-sociales', name: 'Charges sociales' },
  { id: 'autres-charges-personnel', name: 'Autres charges de personnel' },
  { id: 'personnel-interimaire', name: 'Personnel intérimaire' },
  { id: 'personnel-detache', name: 'Personnel détaché' },

  // Charges financières (Financial costs)
  { id: 'interets-emprunts', name: "Intérêts d'emprunts" },
  { id: 'charges-financieres-diverses', name: 'Charges financières diverses' },
  { id: 'pertes-change', name: 'Pertes de change' },

  // Charges exceptionnelles (Exceptional expenses)
  { id: 'charges-exceptionnelles', name: 'Charges exceptionnelles' },
  { id: 'penalites-amendes', name: 'Pénalités et amendes' },
  { id: 'dons-verses', name: 'Dons versés' },

  // CLASSE 7 - PRODUITS (Income/Inflows)
  // Ventes et prestations (Sales and services)
  { id: 'ventes-marchandises', name: 'Ventes de marchandises' },
  { id: 'prestations-services', name: 'Prestations de services' },
  { id: 'production-vendue', name: 'Production vendue' },
  { id: 'prestations-formations', name: 'Prestations de formation' },
  { id: 'ventes-evenements', name: 'Ventes événements' },
  { id: 'locations-diverses', name: 'Locations diverses' },

  // Subventions (Grants and subsidies)
  { id: 'subventions-exploitation', name: "Subventions d'exploitation" },
  { id: 'subventions-etat', name: 'Subventions État' },
  { id: 'subventions-collectivites', name: 'Subventions collectivités' },
  {
    id: 'subventions-organismes-internationaux',
    name: 'Subventions organismes internationaux',
  },
  { id: 'subventions-investissement', name: "Subventions d'investissement" },
  { id: 'subventions-equilibre', name: "Subventions d'équilibre" },

  // Autres produits de gestion courante (Other current income)
  { id: 'cotisations-membres', name: 'Cotisations des membres' },
  {
    id: 'cotisations-avec-contrepartie',
    name: 'Cotisations avec contrepartie',
  },
  {
    id: 'cotisations-sans-contrepartie',
    name: 'Cotisations sans contrepartie',
  },
  { id: 'dons-liberalites', name: 'Dons et libéralités' },
  { id: 'dons-manuels', name: 'Dons manuels' },
  { id: 'legs-donations', name: 'Legs et donations' },
  { id: 'revenus-placements', name: 'Revenus de placements' },
  { id: 'redevances-licences', name: 'Redevances et licences' },
  { id: 'ristournes-cooperatives', name: 'Ristournes de coopératives' },

  // Produits financiers (Financial income)
  { id: 'produits-financiers', name: 'Produits financiers' },
  { id: 'interets-recus', name: 'Intérêts reçus' },
  { id: 'dividendes-recus', name: 'Dividendes reçus' },
  { id: 'gains-change', name: 'Gains de change' },

  // Produits exceptionnels (Exceptional income)
  { id: 'produits-exceptionnels', name: 'Produits exceptionnels' },
  { id: 'plus-values-cessions', name: 'Plus-values de cessions' },
  {
    id: 'remboursements-exercices-anterieurs',
    name: 'Remboursements sur exercices antérieurs',
  },
  { id: 'indemnites-assurances', name: "Indemnités d'assurances" },

  // CATEGORIES SPECIFIQUES ASSOCIATIONS
  // Activités spécifiques aux associations
  { id: 'collectes-publiques', name: 'Collectes publiques' },
  { id: 'manifestations-evenements', name: 'Manifestations et événements' },
  { id: 'ventes-solidaires', name: 'Ventes solidaires' },
  { id: 'activites-lucratives', name: 'Activités lucratives' },
  { id: 'partenariats-mecenats', name: 'Partenariats et mécénats' },
  { id: 'ressources-europeennes', name: 'Ressources européennes' },
  { id: 'appels-projets', name: 'Appels à projets' },

  // Charges spécifiques aux missions
  { id: 'actions-statutaires', name: 'Actions statutaires' },
  { id: 'aide-assistance', name: 'Aide et assistance' },
  { id: 'missions-sociales', name: 'Missions sociales' },
  { id: 'sensibilisation-information', name: 'Sensibilisation et information' },
  { id: 'recherche-developpement', name: 'Recherche et développement' },
  { id: 'actions-humanitaires', name: 'Actions humanitaires' },

  // Fonctionnement interne
  { id: 'frais-assemblees', name: "Frais d'assemblées" },
  {
    id: 'frais-conseils-administration',
    name: "Frais conseils d'administration",
  },
  { id: 'communication-interne', name: 'Communication interne' },
  { id: 'outils-gestion', name: 'Outils de gestion' },
  { id: 'adhesions-reseaux', name: 'Adhésions aux réseaux' },
  { id: 'frais-fonctionnement', name: 'Frais de fonctionnement général' },
];
