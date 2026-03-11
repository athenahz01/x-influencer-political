import type { AccountNode, Category, Scores, GraphEdge } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { computeOverallScore } from '@/lib/scoring';

// ============================================
// Helpers
// ============================================
const clamp = (v: number, lo = 0.05, hi = 0.99) => Math.min(hi, Math.max(lo, v));
const jit = (base: number, range = 0.08) =>
  clamp(base + (Math.random() - 0.5) * range * 2);

let _id = 0;
function makeNode(
  id: string,
  name: string,
  handle: string,
  role: string,
  category: Category,
  followers: number,
  lean: number,
  overrides: Partial<Omit<Scores, 'overall'>> = {}
): AccountNode {
  const audience = clamp(overrides.audience ?? (Math.log10(followers + 1) - 3) / 5);
  const network = clamp(overrides.network ?? jit(0.5 + audience * 0.3));
  const elite = clamp(
    overrides.elite ?? jit(0.5 + (category.id === 'journalist' ? 0.2 : 0))
  );
  const relevance = clamp(overrides.relevance ?? jit(0.75));
  const freshness = clamp(overrides.freshness ?? jit(0.65));
  const bridge = clamp(
    overrides.bridge ?? jit(Math.abs(lean) < 0.3 ? 0.55 : 0.25)
  );

  const scores: Scores = {
    audience,
    network,
    elite,
    relevance,
    freshness,
    bridge,
    overall: 0,
  };
  scores.overall = computeOverallScore(scores);

  return {
    id,
    name,
    handle,
    role,
    followers,
    category,
    lean,
    scores,
    val: Math.max(1.2, scores.overall * 8),
    rank: 0,
    neighbors: [],
    links: [],
  };
}

// ============================================
// SEED NODES — Real political figures
// ============================================
const C = CATEGORIES;

const seedNodes: AccountNode[] = [
  // --- POLITICIANS ---
  makeNode('trump', 'Donald Trump', '@realDonaldTrump', 'President of the United States', C.politician, 87_300_000, 0.9, { audience: 0.99, network: 0.95, elite: 0.98, relevance: 0.90, freshness: 0.95, bridge: 0.08 }),
  makeNode('biden', 'Joe Biden', '@JoeBiden', 'Former President', C.politician, 38_500_000, -0.9, { audience: 0.97, network: 0.90, elite: 0.95, relevance: 0.85, freshness: 0.60, bridge: 0.15 }),
  makeNode('harris', 'Kamala Harris', '@KamalaHarris', 'Former Vice President', C.politician, 22_000_000, -0.85, { audience: 0.95, network: 0.88, elite: 0.92, relevance: 0.85, freshness: 0.55, bridge: 0.12 }),
  makeNode('elonmusk', 'Elon Musk', '@elonmusk', 'Head of DOGE / X Owner', C.politician, 210_000_000, 0.6, { audience: 0.99, network: 0.92, elite: 0.90, relevance: 0.70, freshness: 0.98, bridge: 0.60 }),
  makeNode('aoc', 'Alexandria Ocasio-Cortez', '@AOC', 'U.S. Representative (NY-14)', C.politician, 13_200_000, -1.2, { audience: 0.92, network: 0.82, elite: 0.78, relevance: 0.95, freshness: 0.90, bridge: 0.20 }),
  makeNode('berniesanders', 'Bernie Sanders', '@BernieSanders', 'U.S. Senator (VT)', C.politician, 18_000_000, -1.3, { audience: 0.94, network: 0.85, elite: 0.82, relevance: 0.92, freshness: 0.80, bridge: 0.25 }),
  makeNode('desantis', 'Ron DeSantis', '@GovRonDeSantis', 'Governor of Florida', C.politician, 5_800_000, 0.95, { audience: 0.82, network: 0.78, elite: 0.75, relevance: 0.88, freshness: 0.70, bridge: 0.10 }),
  makeNode('tedcruz', 'Ted Cruz', '@tedcruz', 'U.S. Senator (TX)', C.politician, 6_200_000, 0.85, { audience: 0.82, network: 0.80, elite: 0.72, relevance: 0.88, freshness: 0.82, bridge: 0.12 }),
  makeNode('jdvance', 'JD Vance', '@JDVance', 'Vice President', C.politician, 3_200_000, 0.85, { audience: 0.74, network: 0.82, elite: 0.85, relevance: 0.90, freshness: 0.88, bridge: 0.10 }),
  makeNode('gavinNewsom', 'Gavin Newsom', '@GavinNewsom', 'Governor of California', C.politician, 5_100_000, -0.8, { audience: 0.80, network: 0.75, elite: 0.72, relevance: 0.85, freshness: 0.75, bridge: 0.15 }),
  makeNode('marcorubio', 'Marco Rubio', '@SecRubio', 'Secretary of State', C.politician, 4_700_000, 0.7, { audience: 0.78, network: 0.76, elite: 0.80, relevance: 0.85, freshness: 0.72, bridge: 0.18 }),
  makeNode('elizwarren', 'Elizabeth Warren', '@SenWarren', 'U.S. Senator (MA)', C.politician, 8_500_000, -1.1, { audience: 0.88, network: 0.78, elite: 0.76, relevance: 0.90, freshness: 0.72, bridge: 0.18 }),
  makeNode('mtgreene', 'Marjorie Taylor Greene', '@RepMTG', 'U.S. Representative (GA-14)', C.politician, 3_100_000, 1.3, { audience: 0.74, network: 0.72, elite: 0.55, relevance: 0.88, freshness: 0.85, bridge: 0.05 }),
  makeNode('mikejohnson', 'Mike Johnson', '@SpeakerJohnson', 'Speaker of the House', C.politician, 1_500_000, 0.75, { audience: 0.65, network: 0.80, elite: 0.82, relevance: 0.92, freshness: 0.80, bridge: 0.15 }),
  makeNode('hakeem', 'Hakeem Jeffries', '@RepJeffries', 'House Democratic Leader', C.politician, 1_200_000, -0.7, { audience: 0.62, network: 0.76, elite: 0.78, relevance: 0.90, freshness: 0.78, bridge: 0.18 }),
  makeNode('schumer', 'Chuck Schumer', '@SenSchumer', 'Senate Minority Leader', C.politician, 3_800_000, -0.65, { audience: 0.76, network: 0.78, elite: 0.80, relevance: 0.88, freshness: 0.72, bridge: 0.15 }),

  // --- JOURNALISTS ---
  makeNode('maghaberman', 'Maggie Haberman', '@maggieNYT', 'NYT White House Correspondent', C.journalist, 1_800_000, -0.1, { audience: 0.66, network: 0.88, elite: 0.95, relevance: 0.95, freshness: 0.90, bridge: 0.55 }),
  makeNode('kaitlancollins', 'Kaitlan Collins', '@kabornebusch', 'CNN Anchor', C.journalist, 1_500_000, -0.15, { audience: 0.65, network: 0.80, elite: 0.85, relevance: 0.92, freshness: 0.88, bridge: 0.45 }),
  makeNode('jaketapper', 'Jake Tapper', '@jaketapper', 'CNN Lead Washington Anchor', C.journalist, 3_200_000, -0.2, { audience: 0.74, network: 0.82, elite: 0.88, relevance: 0.90, freshness: 0.82, bridge: 0.50 }),
  makeNode('seanhannity', 'Sean Hannity', '@seanhannity', 'Fox News Host', C.journalist, 6_500_000, 0.95, { audience: 0.82, network: 0.78, elite: 0.72, relevance: 0.88, freshness: 0.85, bridge: 0.08 }),
  makeNode('tuckercarlson', 'Tucker Carlson', '@TuckerCarlson', 'Independent Media Host', C.journalist, 12_500_000, 1.1, { audience: 0.92, network: 0.82, elite: 0.75, relevance: 0.90, freshness: 0.92, bridge: 0.15 }),
  makeNode('rachelmaddow', 'Rachel Maddow', '@maddow', 'MSNBC Host', C.journalist, 10_500_000, -1.1, { audience: 0.90, network: 0.82, elite: 0.80, relevance: 0.92, freshness: 0.72, bridge: 0.10 }),
  makeNode('andersoncooper', 'Anderson Cooper', '@andersoncooper', 'CNN Anchor', C.journalist, 5_800_000, -0.3, { audience: 0.82, network: 0.78, elite: 0.80, relevance: 0.85, freshness: 0.75, bridge: 0.40 }),
  makeNode('chrishayes', 'Chris Hayes', '@chrislhayes', 'MSNBC Host', C.journalist, 2_800_000, -0.9, { audience: 0.72, network: 0.78, elite: 0.82, relevance: 0.90, freshness: 0.80, bridge: 0.15 }),
  makeNode('bretbaier', 'Bret Baier', '@BretBaier', 'Fox News Chief Political Anchor', C.journalist, 2_200_000, 0.3, { audience: 0.68, network: 0.76, elite: 0.78, relevance: 0.88, freshness: 0.80, bridge: 0.35 }),

  // --- PODCASTS ---
  makeNode('joerogan', 'Joe Rogan', '@joerogan', 'Host, The Joe Rogan Experience', C.podcast, 18_000_000, 0.2, { audience: 0.94, network: 0.78, elite: 0.62, relevance: 0.55, freshness: 0.92, bridge: 0.80 }),
  makeNode('benshapiro', 'Ben Shapiro', '@benshapiro', 'Host, The Ben Shapiro Show', C.podcast, 6_400_000, 1.2, { audience: 0.82, network: 0.85, elite: 0.72, relevance: 0.95, freshness: 0.90, bridge: 0.12 }),
  makeNode('megynkelly', 'Megyn Kelly', '@megynkelly', 'Host, The Megyn Kelly Show', C.podcast, 2_800_000, 0.5, { audience: 0.72, network: 0.75, elite: 0.68, relevance: 0.85, freshness: 0.88, bridge: 0.35 }),
  makeNode('ezraklein', 'Ezra Klein', '@ezraklein', 'Host, The Ezra Klein Show (NYT)', C.podcast, 1_200_000, -0.6, { audience: 0.62, network: 0.82, elite: 0.90, relevance: 0.92, freshness: 0.85, bridge: 0.55 }),
  makeNode('danabrams', 'Dan Abrams', '@danabrams', 'Host, Dan Abrams Live', C.podcast, 850_000, 0.0, { audience: 0.56, network: 0.70, elite: 0.72, relevance: 0.82, freshness: 0.78, bridge: 0.55 }),
  makeNode('timpool', 'Tim Pool', '@Timcast', 'Host, Timcast IRL', C.podcast, 2_100_000, 0.9, { audience: 0.68, network: 0.70, elite: 0.48, relevance: 0.82, freshness: 0.85, bridge: 0.10 }),
  makeNode('chriscuomo', 'Chris Cuomo', '@ChrisCuomo', 'Host, The Chris Cuomo Project', C.podcast, 2_500_000, -0.2, { audience: 0.70, network: 0.68, elite: 0.62, relevance: 0.78, freshness: 0.82, bridge: 0.45 }),

  // --- MEDIA ORGS ---
  makeNode('cnn', 'CNN', '@CNN', 'Cable News Network', C.media, 61_500_000, -0.2, { audience: 0.99, network: 0.82, elite: 0.85, relevance: 0.88, freshness: 0.95, bridge: 0.55 }),
  makeNode('foxnews', 'Fox News', '@FoxNews', 'Fox News Channel', C.media, 25_000_000, 0.7, { audience: 0.97, network: 0.80, elite: 0.78, relevance: 0.90, freshness: 0.95, bridge: 0.20 }),
  makeNode('msnbc', 'MSNBC', '@MSNBC', 'MSNBC News Network', C.media, 4_500_000, -0.8, { audience: 0.78, network: 0.75, elite: 0.72, relevance: 0.90, freshness: 0.90, bridge: 0.15 }),
  makeNode('nytimes', 'The New York Times', '@nytimes', 'National Newspaper of Record', C.media, 55_000_000, -0.3, { audience: 0.99, network: 0.85, elite: 0.90, relevance: 0.85, freshness: 0.95, bridge: 0.60 }),
  makeNode('washpost', 'Washington Post', '@washingtonpost', 'National Newspaper', C.media, 19_800_000, -0.3, { audience: 0.95, network: 0.82, elite: 0.88, relevance: 0.88, freshness: 0.92, bridge: 0.55 }),
  makeNode('wsj', 'Wall Street Journal', '@WSJ', 'National Business Newspaper', C.media, 20_500_000, 0.1, { audience: 0.95, network: 0.80, elite: 0.85, relevance: 0.82, freshness: 0.92, bridge: 0.60 }),
  makeNode('politico', 'POLITICO', '@politico', 'Political News Organization', C.media, 4_200_000, -0.1, { audience: 0.78, network: 0.85, elite: 0.90, relevance: 0.98, freshness: 0.92, bridge: 0.50 }),
  makeNode('thehill', 'The Hill', '@thehill', 'Political News Site', C.media, 5_500_000, 0.0, { audience: 0.80, network: 0.78, elite: 0.75, relevance: 0.95, freshness: 0.90, bridge: 0.55 }),
  makeNode('axios', 'Axios', '@axios', 'News & Media Company', C.media, 2_800_000, -0.1, { audience: 0.72, network: 0.80, elite: 0.85, relevance: 0.90, freshness: 0.90, bridge: 0.50 }),
  makeNode('dailywire', 'Daily Wire', '@realDailyWire', 'Conservative Media Company', C.media, 2_400_000, 1.0, { audience: 0.70, network: 0.72, elite: 0.60, relevance: 0.90, freshness: 0.88, bridge: 0.08 }),

  // --- COMMENTATORS ---
  makeNode('natesilver', 'Nate Silver', '@NateSilver538', 'Statistician & Election Analyst', C.commentator, 3_400_000, -0.05, { audience: 0.74, network: 0.88, elite: 0.95, relevance: 0.92, freshness: 0.80, bridge: 0.70 }),
  makeNode('charliekirk', 'Charlie Kirk', '@charliekirk11', 'Turning Point USA Founder', C.commentator, 4_500_000, 1.2, { audience: 0.78, network: 0.75, elite: 0.62, relevance: 0.90, freshness: 0.88, bridge: 0.08 }),
  makeNode('dineshdsouza', "Dinesh D'Souza", '@DineshDSouza', 'Conservative Author', C.commentator, 2_800_000, 1.1, { audience: 0.72, network: 0.68, elite: 0.55, relevance: 0.82, freshness: 0.75, bridge: 0.05 }),
  makeNode('vanjones', 'Van Jones', '@VanJones68', 'CNN Political Commentator', C.commentator, 2_200_000, -0.7, { audience: 0.68, network: 0.75, elite: 0.78, relevance: 0.88, freshness: 0.75, bridge: 0.40 }),
  makeNode('anncoulter', 'Ann Coulter', '@AnnCoulter', 'Conservative Commentator', C.commentator, 3_200_000, 1.0, { audience: 0.74, network: 0.70, elite: 0.62, relevance: 0.85, freshness: 0.72, bridge: 0.10 }),
  makeNode('jonahgoldberg', 'Jonah Goldberg', '@JonahDispatch', 'The Dispatch Editor', C.commentator, 420_000, 0.3, { audience: 0.52, network: 0.78, elite: 0.88, relevance: 0.90, freshness: 0.75, bridge: 0.65 }),
  makeNode('mattyglesias', 'Matt Yglesias', '@mattyglesias', 'Slow Boring Newsletter', C.commentator, 800_000, -0.4, { audience: 0.56, network: 0.82, elite: 0.90, relevance: 0.92, freshness: 0.85, bridge: 0.58 }),

  // --- STRATEGISTS / THINK TANKS ---
  makeNode('heritage', 'Heritage Foundation', '@Heritage', 'Conservative Think Tank', C.strategist, 1_500_000, 0.9, { audience: 0.65, network: 0.75, elite: 0.78, relevance: 0.95, freshness: 0.80, bridge: 0.10 }),
  makeNode('brookings', 'Brookings Institution', '@BrookingsInst', 'Public Policy Think Tank', C.strategist, 820_000, -0.4, { audience: 0.56, network: 0.78, elite: 0.85, relevance: 0.92, freshness: 0.78, bridge: 0.50 }),
  makeNode('cato', 'Cato Institute', '@CatoInstitute', 'Libertarian Think Tank', C.strategist, 480_000, 0.3, { audience: 0.50, network: 0.72, elite: 0.78, relevance: 0.88, freshness: 0.72, bridge: 0.62 }),
  makeNode('cap', 'Center for American Progress', '@CAPAction', 'Progressive Think Tank', C.strategist, 350_000, -0.8, { audience: 0.48, network: 0.70, elite: 0.75, relevance: 0.90, freshness: 0.75, bridge: 0.15 }),
  makeNode('kellyanne', 'Kellyanne Conway', '@KellyannePolls', 'Former Senior Counselor', C.strategist, 3_200_000, 0.8, { audience: 0.74, network: 0.72, elite: 0.70, relevance: 0.82, freshness: 0.65, bridge: 0.15 }),
  makeNode('jamescarville', 'James Carville', '@JamesCarville', 'Democratic Strategist', C.strategist, 780_000, -0.7, { audience: 0.55, network: 0.72, elite: 0.78, relevance: 0.85, freshness: 0.72, bridge: 0.30 }),
  makeNode('karlrove', 'Karl Rove', '@KarlRove', 'Republican Strategist', C.strategist, 550_000, 0.6, { audience: 0.52, network: 0.70, elite: 0.78, relevance: 0.85, freshness: 0.68, bridge: 0.25 }),
];

// ============================================
// PROCEDURAL ADDITIONS — more real figures
// ============================================
type ProcEntry = [string, string, string, number]; // [name, handle, role, lean]

const procData: Record<string, ProcEntry[]> = {
  politician: [
    ['Josh Hawley', '@JoshHawleyMO', 'Sen (MO)', 0.8],
    ['Cori Bush', '@CoriBush', 'Former Rep (MO)', -1.1],
    ['Matt Gaetz', '@mattgaetz', 'Former Rep (FL)', 1.2],
    ['Pete Buttigieg', '@PeteButtigieg', 'Former Sec. Transportation', -0.5],
    ['Nikki Haley', '@NikkiHaley', 'Former UN Ambassador', 0.4],
    ['Tom Cotton', '@SenTomCotton', 'Sen (AR)', 0.9],
    ['Katie Porter', '@KatiePorter', 'Former Rep (CA)', -0.9],
    ['Adam Schiff', '@RepAdamSchiff', 'Sen (CA)', -0.6],
    ['Dan Crenshaw', '@DanCrenshawTX', 'Rep (TX)', 0.7],
    ['Ilhan Omar', '@IlhanMN', 'Rep (MN)', -1.2],
    ['Vivek Ramaswamy', '@VivekGRamaswamy', 'DOGE Co-lead', 0.8],
    ['Tim Scott', '@SenatorTimScott', 'Sen (SC)', 0.6],
    ['Cory Booker', '@CoryBooker', 'Sen (NJ)', -0.7],
    ['Rand Paul', '@RandPaul', 'Sen (KY)', 0.7],
    ['Tammy Duckworth', '@SenDuckworth', 'Sen (IL)', -0.5],
    ['John Fetterman', '@SenFettermanPA', 'Sen (PA)', -0.3],
    ['Lauren Boebert', '@laurenboebert', 'Rep (CO)', 1.2],
    ['Ro Khanna', '@RoKhanna', 'Rep (CA)', -0.8],
    ['Mike Lee', '@SenMikeLee', 'Sen (UT)', 0.9],
    ['Amy Klobuchar', '@amyklobuchar', 'Sen (MN)', -0.5],
    ['Rick Scott', '@SenRickScott', 'Sen (FL)', 0.7],
    ['Pramila Jayapal', '@PramilaJayapal', 'Rep (WA)', -1.0],
    ['Jim Jordan', '@Jim_Jordan', 'Rep (OH)', 0.9],
    ['Tulsi Gabbard', '@TulsiGabbard', 'DNI Director', -0.2],
    ['Nancy Pelosi', '@SpeakerPelosi', 'Former Speaker', -0.6],
    ['Mitch McConnell', '@LeaderMcConnell', 'Former Senate Leader', 0.5],
  ],
  journalist: [
    ['Jonathan Swan', '@jonathanvswan', 'NYT Reporter', -0.05],
    ['Peter Doocy', '@pdoocy', 'Fox WH Correspondent', 0.4],
    ['Kasie Hunt', '@kasabornebusch', 'CNN Anchor', -0.1],
    ['Kristen Welker', '@kwelkernbc', 'NBC Meet the Press', -0.1],
    ['Laura Ingraham', '@IngrahamAngle', 'Fox News Host', 0.9],
    ['Joy Reid', '@JoyAnnReid', 'MSNBC Host', -1.0],
    ['Jesse Watters', '@JesseBWatters', 'Fox News Host', 0.8],
    ['Nicolle Wallace', '@NicolleDWallace', 'MSNBC Host', -0.7],
    ['Dana Bash', '@DanaBash', 'CNN Anchor', -0.1],
    ['Neil Cavuto', '@TeamCavuto', 'Fox Business', 0.2],
  ],
  podcast: [
    ['Dan Bongino', '@dbongino', 'The Dan Bongino Show', 0.9],
    ['Krystal Ball', '@krystalball', 'Breaking Points', -0.4],
    ['Saagar Enjeti', '@esaagar', 'Breaking Points', 0.2],
    ['Lex Fridman', '@lexfridman', 'Lex Fridman Podcast', 0.1],
    ['Sam Harris', '@SamHarrisOrg', 'Making Sense', -0.2],
    ['Kara Swisher', '@karaswisher', 'Pivot Podcast', -0.2],
    ['Glenn Greenwald', '@ggreenwald', 'System Update', 0.3],
    ['Michael Knowles', '@michaelknowles', 'Daily Wire Host', 1.0],
  ],
  media: [
    ['NPR', '@NPR', 'National Public Radio', -0.4],
    ['AP News', '@AP', 'Associated Press', 0.0],
    ['Reuters', '@Reuters', 'Wire Service', 0.0],
    ['Breitbart News', '@BreitbartNews', 'Conservative Outlet', 1.2],
    ['HuffPost', '@HuffPost', 'Progressive Outlet', -0.8],
    ['The Intercept', '@theintercept', 'Investigative', -0.7],
    ['Newsmax', '@newsmax', 'Conservative Network', 1.0],
  ],
  commentator: [
    ['David French', '@DavidAFrench', 'NYT Columnist', 0.2],
    ['Ross Douthat', '@DouthatNYT', 'NYT Columnist', 0.3],
    ['Paul Krugman', '@paulkrugman', 'Economist', -0.7],
    ['Candace Owens', '@RealCandaceO', 'Commentator', 1.1],
    ['Keith Olbermann', '@KeithOlbermann', 'Commentator', -1.2],
    ['Scott Adams', '@ScottAdamsSays', 'Commentator', 0.6],
  ],
  strategist: [
    ['David Axelrod', '@davidaxelrod', 'Former Obama Strategist', -0.5],
    ['Steve Bannon', '@SteveBannon', 'Former WH Strategist', 1.1],
    ['Donna Brazile', '@donnabrazile', 'Dem Strategist', -0.7],
    ['Frank Luntz', '@FrankLuntz', 'Republican Pollster', 0.4],
    ['AEI', '@AEI', 'American Enterprise Institute', 0.5],
    ['RAND Corp', '@RANDCorporation', 'Policy Research', 0.0],
  ],
};

Object.entries(procData).forEach(([catKey, people]) => {
  const cat = CATEGORIES[catKey as keyof typeof CATEGORIES];
  people.forEach((p) => {
    const followers = Math.floor(Math.pow(10, Math.random() * 2.5 + 4));
    seedNodes.push(
      makeNode(`proc_${_id++}`, p[0], p[1], p[2], cat, followers, p[3])
    );
  });
});

// ============================================
// PAD TO ~300 with procedural nodes
// ============================================
const gFirstNames = ['James', 'Sarah', 'Michael', 'Elena', 'David', 'Ana', 'Chris', 'Maya', 'Robert', 'Lisa', 'Daniel', 'Rachel', 'Thomas', 'Sophia', 'Andrew', 'Natalie', 'William', 'Olivia'];
const gLastNames = ['Mitchell', 'Rodriguez', 'Chen', 'Patel', 'Kim', 'Washington', 'Kowalski', 'Alvarez', 'Santos', 'Reeves', 'Taylor', 'Nguyen', 'Foster', 'Hamilton', 'Brooks', 'Coleman'];
const gRoles = ['Political Analyst', 'Policy Director', 'National Reporter', 'Campaign Consultant', 'Digital Strategist', 'Political Scientist', 'Legislative Aide', 'Communications Dir.'];
const allCats = Object.values(CATEGORIES);

while (seedNodes.length < 300) {
  const cat = allCats[Math.floor(Math.random() * allCats.length)];
  const fn = gFirstNames[Math.floor(Math.random() * gFirstNames.length)];
  const ln = gLastNames[Math.floor(Math.random() * gLastNames.length)];
  const role = gRoles[Math.floor(Math.random() * gRoles.length)];
  const followers = Math.floor(Math.pow(10, Math.random() * 2.5 + 3.5));
  const lean = Math.random() * 3 - 1.5;
  seedNodes.push(
    makeNode(
      `gen_${_id++}`,
      `${fn} ${ln}`,
      `@${fn}${ln}`.replace(/[^a-zA-Z@]/g, ''),
      role,
      cat,
      followers,
      lean
    )
  );
}

// ============================================
// EDGE GENERATION — ideological clustering
// ============================================
function generateEdges(nodes: AccountNode[]): GraphEdge[] {
  const edges: GraphEdge[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const leanDiff = Math.abs(a.lean - b.lean);

      let prob = 0.0015;
      if (leanDiff < 0.3) prob += 0.018;
      else if (leanDiff < 0.6) prob += 0.008;
      else if (leanDiff < 1.0) prob += 0.003;

      if (a.scores.overall > 0.75 || b.scores.overall > 0.75) prob += 0.012;
      if (a.scores.bridge > 0.6 || b.scores.bridge > 0.6) prob += 0.006;
      if (a.category === b.category) prob += 0.004;

      if (Math.random() < prob) {
        edges.push({ source: a.id, target: b.id });
      }
    }
  }
  return edges;
}

// ============================================
// EXPORT — build the full graph
// ============================================
export function buildGraphData(): {
  nodes: AccountNode[];
  links: GraphEdge[];
} {
  const nodes = [...seedNodes];
  const links = generateEdges(nodes);

  // Sort by overall score and assign ranks
  nodes.sort((a, b) => b.scores.overall - a.scores.overall);
  nodes.forEach((n, i) => (n.rank = i + 1));

  // Build neighbor/link references
  nodes.forEach((n) => {
    n.neighbors = [];
    n.links = [];
  });

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  links.forEach((link) => {
    const a = nodeMap.get(link.source as string);
    const b = nodeMap.get(link.target as string);
    if (a && b) {
      a.neighbors.push(b);
      b.neighbors.push(a);
      a.links.push(link);
      b.links.push(link);
    }
  });

  return { nodes, links };
}
