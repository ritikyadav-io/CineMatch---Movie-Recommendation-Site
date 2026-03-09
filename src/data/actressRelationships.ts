/** Hardcoded relationship data for actresses. Key = TMDB person ID */
export interface RelationshipInfo {
  current?: { name: string; since?: string; type: "married" | "dating" | "engaged" };
  exes?: { name: string; years?: string }[];
}

export const ACTRESS_RELATIONSHIPS: Record<number, RelationshipInfo> = {
  // ── Hollywood ──
  90633: { // Gal Gadot
    current: { name: "Yaron Varsano", since: "2008", type: "married" },
  },
  1245: { // Scarlett Johansson
    current: { name: "Colin Jost", since: "2020", type: "married" },
    exes: [{ name: "Romain Dauriac", years: "2014–2017" }, { name: "Ryan Reynolds", years: "2008–2011" }],
  },
  224513: { // Ana de Armas
    exes: [{ name: "Ben Affleck", years: "2020–2021" }, { name: "Marc Clotet", years: "2011–2013" }],
  },
  505710: { // Zendaya
    current: { name: "Tom Holland", since: "2021", type: "dating" },
  },
  115440: { // Sydney Sweeney
    current: { name: "Jonathan Davino", since: "2018", type: "engaged" },
  },
  1373737: { // Florence Pugh
    exes: [{ name: "Zach Braff", years: "2019–2022" }],
  },
  54693: { // Emma Stone
    current: { name: "Dave McCary", since: "2020", type: "married" },
    exes: [{ name: "Andrew Garfield", years: "2011–2015" }],
  },
  1813: { // Anne Hathaway
    current: { name: "Adam Shulman", since: "2012", type: "married" },
  },
  6885: { // Charlize Theron
    exes: [{ name: "Sean Penn", years: "2013–2015" }, { name: "Stuart Townsend", years: "2002–2010" }],
  },
  18050: { // Natalie Portman
    current: { name: "Benjamin Millepied", since: "2012", type: "married" },
  },
  112: { // Cate Blanchett
    current: { name: "Andrew Upton", since: "1997", type: "married" },
  },
  1245982: { // Margot Robbie
    current: { name: "Tom Ackerley", since: "2016", type: "married" },
  },
  8691: { // Zoe Saldana
    current: { name: "Marco Perego", since: "2013", type: "married" },
  },
  17018: { // Angelina Jolie
    exes: [{ name: "Brad Pitt", years: "2014–2019" }, { name: "Billy Bob Thornton", years: "2000–2003" }, { name: "Jonny Lee Miller", years: "1996–2000" }],
  },
  72129: { // Jennifer Lawrence
    current: { name: "Cooke Maroney", since: "2019", type: "married" },
    exes: [{ name: "Darren Aronofsky", years: "2016–2017" }, { name: "Nicholas Hoult", years: "2010–2014" }],
  },
  118545: { // Dakota Johnson
    current: { name: "Chris Martin", since: "2017", type: "dating" },
  },
  36662: { // Emilia Clarke
    exes: [{ name: "Seth MacFarlane", years: "2012–2013" }],
  },
  1903874: { // Anya Taylor-Joy
    current: { name: "Malcolm McRae", since: "2022", type: "married" },
  },
  10990: { // Emma Watson
    exes: [{ name: "Brendan Wallace", years: "2021–2023" }],
  },
  4491: { // Jennifer Aniston
    exes: [{ name: "Justin Theroux", years: "2015–2017" }, { name: "Brad Pitt", years: "2000–2005" }],
  },
  9273: { // Amy Adams
    current: { name: "Darren Le Gallo", since: "2015", type: "married" },
  },
  60073: { // Brie Larson
    exes: [{ name: "Alex Greenwald", years: "2013–2019" }],
  },
  71070: { // Amanda Seyfried
    current: { name: "Thomas Sadoski", since: "2017", type: "married" },
  },
  974169: { // Jenna Ortega
    // No confirmed public relationship
  },
  1315036: { // Daisy Ridley
    current: { name: "Tom Bateman", since: "2023", type: "married" },
  },

  // ── Bollywood ──
  53975: { // Deepika Padukone
    current: { name: "Ranveer Singh", since: "2018", type: "married" },
    exes: [{ name: "Ranbir Kapoor", years: "2008–2012" }],
  },
  1108120: { // Alia Bhatt
    current: { name: "Ranbir Kapoor", since: "2022", type: "married" },
    exes: [{ name: "Sidharth Malhotra", years: "2014–2017" }],
  },
  77234: { // Priyanka Chopra
    current: { name: "Nick Jonas", since: "2018", type: "married" },
  },
  81869: { // Katrina Kaif
    current: { name: "Vicky Kaushal", since: "2021", type: "married" },
    exes: [{ name: "Ranbir Kapoor", years: "2013–2016" }, { name: "Salman Khan", years: "2003–2010" }],
  },
  81928: { // Anushka Sharma
    current: { name: "Virat Kohli", since: "2017", type: "married" },
  },
  1340978: { // Kiara Advani
    current: { name: "Sidharth Malhotra", since: "2023", type: "married" },
  },
  87773: { // Aishwarya Rai Bachchan
    current: { name: "Abhishek Bachchan", since: "2007", type: "married" },
    exes: [{ name: "Salman Khan", years: "1999–2002" }, { name: "Vivek Oberoi", years: "2003–2004" }],
  },
  130991: { // Shraddha Kapoor
    current: { name: "Rahul Mody", since: "2024", type: "dating" },
    exes: [{ name: "Aditya Roy Kapur", years: "2014–2016" }, { name: "Rohan Shrestha", years: "2019–2022" }],
  },
  1546398: { // Disha Patani
    exes: [{ name: "Tiger Shroff", years: "2017–2023" }],
  },
  1848952: { // Sara Ali Khan
    exes: [{ name: "Kartik Aaryan", years: "2019–2020" }],
  },
  1974970: { // Janhvi Kapoor
    exes: [{ name: "Shikhar Pahariya", years: "2023–2024" }],
  },
  1973077: { // Ananya Panday
    current: { name: "Aditya Roy Kapur", since: "2023", type: "dating" },
  },

  // ── Korean ──
  1252318: { // IU
    current: { name: "Lee Jong-suk", since: "2022", type: "dating" },
  },
  1254899: { // Bae Suzy
    exes: [{ name: "Lee Dong-wook", years: "2018" }, { name: "Lee Min-ho", years: "2015–2017" }],
  },
  2056938: { // Han So-hee
    exes: [{ name: "Ryu Jun-yeol", years: "2024" }],
  },
  74421: { // Song Hye-kyo
    exes: [{ name: "Song Joong-ki", years: "2017–2019" }, { name: "Hyun Bin", years: "2008–2011" }],
  },
  1329674: { // Jun Ji-hyun
    current: { name: "Choi Joon-hyuk", since: "2012", type: "married" },
  },
  1251762: { // Park Shin-hye
    current: { name: "Choi Tae-joon", since: "2022", type: "married" },
  },

  // ── Spanish / Latin ──
  955: { // Penélope Cruz
    current: { name: "Javier Bardem", since: "2010", type: "married" },
    exes: [{ name: "Tom Cruise", years: "2001–2004" }, { name: "Matthew McConaughey", years: "2005–2006" }],
  },
  1267: { // Salma Hayek
    current: { name: "François-Henri Pinault", since: "2009", type: "married" },
  },

  // ── Pakistani ──
  557894: { // Mahira Khan
    current: { name: "Salim Karim", since: "2024", type: "married" },
    exes: [{ name: "Ali Askari", years: "2007–2015" }],
  },
  1816076: { // Hania Aamir
    exes: [{ name: "Asim Azhar", years: "2019–2021" }],
  },
  2058151: { // Iqra Aziz
    current: { name: "Yasir Hussain", since: "2019", type: "married" },
  },

  // ── Australian ──
  9827: { // Rose Byrne
    current: { name: "Bobby Cannavale", since: "2012", type: "dating" },
  },
  10978: { // Isla Fisher
    exes: [{ name: "Sacha Baron Cohen", years: "2010–2023" }],
  },
};
