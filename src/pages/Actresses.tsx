import { Link } from "react-router-dom";

import { DNAFooter } from "@/components/moviedna/DNAFooter";
import { DNANav } from "@/components/moviedna/DNANav";

export const TMDB_ACTRESSES = [
  // Hollywood A-list
  { id: 90633, name: "Gal Gadot", img: "/fBJducGBcmrcIOQdhm4t0A2nEMj.jpg" },
  { id: 1245, name: "Scarlett Johansson", img: "/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg" },
  { id: 224513, name: "Ana de Armas", img: "/3vxvsmYLTf4jnr163SUlBIw51ee.jpg" },
  { id: 1397778, name: "Zendaya", img: "/bGlpMpESnMOGiQIlIGGaoSMaHSH.jpg" },
  { id: 115440, name: "Sydney Sweeney", img: "/qYiaSl0Eb7G3VaxOg8PQe5RMkFe.jpg" },
  { id: 71580, name: "Florence Pugh", img: "/6FBy4YNQB3pKEHx4F0bSAGasMH0.jpg" },
  { id: 54693, name: "Emma Stone", img: "/2hwXbPW2ffnXUe1Um0WXHG0cTwb.jpg" },
  { id: 1813, name: "Anne Hathaway", img: "/tLelKoPNiyJCSEtQTz1FGv4TLGc.jpg" },
  { id: 6885, name: "Charlize Theron", img: "/1HroTIIuk0Eo0DSLo5DXKM7BXjP.jpg" },
  { id: 18050, name: "Natalie Portman", img: "/edPU5HxncLWa1YkgRPNkSd0ydTe.jpg" },
  { id: 112, name: "Cate Blanchett", img: "/vUuoHy7Ht2JOFtGjFyRaJyP7FPj.jpg" },
  { id: 1245982, name: "Margot Robbie", img: "/euDPyqLnuwaWMHR6JN0sWUiV2LH.jpg" },
  { id: 5064, name: "Meryl Streep", img: "/emAAzyK1LmzdN8EMEpx0Bqp2tOo.jpg" },
  { id: 8691, name: "Zoe Saldana", img: "/iOVbUH20il632nj2v01NCtYYeSg.jpg" },
  { id: 17018, name: "Angelina Jolie", img: "/gEEFaMaIPiJdNdXJERMiWnCilHn.jpg" },
  { id: 72129, name: "Jennifer Lawrence", img: "/mDLDCKaEhDCMFBquThPHRE3oTqN.jpg" },
  { id: 9780, name: "Dakota Johnson", img: "/pHBhEkXWhXgFKMRGEPa1uJQJIZr.jpg" },
  { id: 1283, name: "Helena Bonham Carter", img: "/mSmMKIFCCvPJJyEmWiDVRVbpHbO.jpg" },
  { id: 205, name: "Kirsten Dunst", img: "/5EaylWJNhBOhVPHtCwPT7v7z1Cu.jpg" },
  { id: 36662, name: "Emilia Clarke", img: "/j7d083zIMAALMXMgjkVGgHGif0C.jpg" },
  { id: 974169, name: "Jenna Ortega", img: "/q1NRzyZQlYkjXjhgnc2UGAmwIOC.jpg" },
  { id: 1903874, name: "Anya Taylor-Joy", img: "/yZpghhtSim0VIHJlAIBhtYpBxef.jpg" },
  { id: 10990, name: "Emma Watson", img: "/A14lLCZYDhfYdBa0fFRpwMDiwRN.jpg" },
  { id: 1356210, name: "Hailee Steinfeld", img: "/dxSDWkiVaC6JYjrV3GMDJ5MtfBp.jpg" },
  { id: 56731, name: "Elizabeth Olsen", img: "/wIU1ggCHuvx0M0gq0GonZKMdN2v.jpg" },
  { id: 1251768, name: "Samara Weaving", img: "/7lhMYurqJTHC4pkGPfYWOmjXnkX.jpg" },
  { id: 15556, name: "Megan Fox", img: "/kLmzD28GhOFiJHbgabLJPUKHSiZ.jpg" },
  { id: 1136406, name: "Tom Holland", img: "/bBRlrpJm9XkNSg0YT5LCaxqoFMX.jpg" },
  // More Hollywood
  { id: 234352, name: "Brie Larson", img: "/8RpkBalJin68LMEF3dHkhB9HMCR.jpg" },
  { id: 1938, name: "Jessica Alba", img: "/fCyduFBbUBMkHOihINBOjKlmfAV.jpg" },
  { id: 6161, name: "Jennifer Aniston", img: "/l1hLUMJHrFMcUoB3fJNUaVlxPr2.jpg" },
  { id: 1813, name: "Anne Hathaway", img: "/tLelKoPNiyJCSEtQTz1FGv4TLGc.jpg" },
  { id: 12835, name: "Viola Davis", img: "/xDssKnBPoMaJFNJR0V1vwGMIhGj.jpg" },
  { id: 8944, name: "Jamie Lee Curtis", img: "/rredGSFvDlO7mVzgelFf5qOZerg.jpg" },
  { id: 5081, name: "Emily Blunt", img: "/nPJXaVulnkBLEJBFcoSLycZnODx.jpg" },
  { id: 2524, name: "Tom Hardy", img: "/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg" },
  { id: 1892, name: "Matt Damon", img: "/elSlNgV8xVifsbHpFsqrPGxYXiB.jpg" },
  { id: 73457, name: "Chris Hemsworth", img: "/piQGEbMSrawmjNULmFSRQi1cIVE.jpg" },
  { id: 74568, name: "Chris Evans", img: "/3bOGNsHlrswhyW79uvIHH1V43JI.jpg" },
  { id: 117642, name: "Jason Momoa", img: "/6dEFBpZH8C8OijsynkSajQT99Pb.jpg" },
  { id: 10859, name: "Ryan Reynolds", img: "/algQ1VEno2W9SesoArWcZTeF3tb.jpg" },
  { id: 6193, name: "Leonardo DiCaprio", img: "/wo2hJpn04vbtmh0B9utCFa3tAHs.jpg" },
  { id: 287, name: "Brad Pitt", img: "/tJiSUYst4ddIaz1zge2LqCtu9tw.jpg" },
  { id: 2963, name: "Nicolas Cage", img: "/ue0VfTBzgzFnkn0W1MQbTXtpFA0.jpg" },
  { id: 1190668, name: "Timothée Chalamet", img: "/BE2sdjpgsa2rNTFa66f7upkaOP.jpg" },
  { id: 880, name: "Ben Affleck", img: "/xyMnFOTsTqj8wddIsMCjBdhWOio.jpg" },
  { id: 3223, name: "Robert Downey Jr.", img: "/im9SAqJPZKEbVZGmjXuLI4O7RvM.jpg" },
  { id: 16828, name: "Chris Pratt", img: "/83o3koL82jt30EJ0rz4Bnzrt2dd.jpg" },
  // Bollywood
  { id: 86009, name: "Deepika Padukone", img: "/v09kwLjjXGmQzSPw2MHIT3zGkdE.jpg" },
  { id: 28782, name: "Priyanka Chopra", img: "/1EJiyVO9FPxPccWPa14mh1IHmwn.jpg" },
  { id: 1181313, name: "Alia Bhatt", img: "/mCYgMpMAAAAlTq7YfE6aWlAoUsl.jpg" },
  { id: 237405, name: "Shraddha Kapoor", img: "/8tTjGXvd7jG0gKjHWrCL76mLbRR.jpg" },
  { id: 35742, name: "Shah Rukh Khan", img: "/tCEppfUo0g2Kj45jnJ37WBakBqH.jpg" },
  { id: 224235, name: "Ranveer Singh", img: "/bDmnMqLMtiwz8fHCiHKsgFalSiE.jpg" },
  { id: 85, name: "Johnny Depp", img: "/wcI00YoKOf6FPTyrGriWRbMvKRi.jpg" },
  { id: 17419, name: "Bryan Cranston", img: "/7Jahy5LZX2Fo8fGJltMreAI49Bf.jpg" },
  { id: 1373737, name: "Florence Pugh", img: "/6FBy4YNQB3pKEHx4F0bSAGasMH0.jpg" },
  { id: 1373737, name: "Millie Bobby Brown", img: "/3iIkM2i4GB4fGMzXBjE3FBxOoJT.jpg" },
  { id: 1734071, name: "Millie Bobby Brown", img: "/3iIkM2i4GB4fGMzXBjE3FBxOoJT.jpg" },
  { id: 119589, name: "Keanu Reeves", img: "/4D0PbQRDfkEYKCloORkBBn3HIed.jpg" },
  { id: 500, name: "Tom Cruise", img: "/eOh4ubpOm2Igdg0QH2ghj0mFtC.jpg" },
  { id: 976, name: "Jason Statham", img: "/whNwkEQk2GlcEGrFi0FW3tiGHmu.jpg" },
  { id: 1229, name: "Jeff Bridges", img: "/xms1RAY5jxJmpHOd1kcBCFbkNbM.jpg" },
  { id: 17277, name: "Rachel McAdams", img: "/2xytu5MOVrmbccJhgQzGCrwdOvR.jpg" },
  { id: 5292, name: "Denzel Washington", img: "/jj2Gcobpopokal0YstuCQW0ldJ4.jpg" },
  { id: 3894, name: "Christian Bale", img: "/qCpZn2e3dimwbryLnqxZuI88PTi.jpg" },
  { id: 1100, name: "Arnold Schwarzenegger", img: "/z6IbTtI31Yd5RVdLbwzAkNJhJyJ.jpg" },
].filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i)
  .filter((a) => a.img)
  .sort((a, b) => a.name.localeCompare(b.name));

const ActressesPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DNANav />

      <main className="container pt-16 pb-8 sm:pt-20 sm:pb-12 px-4 sm:px-6">
        <div className="space-y-1 mb-6">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">A to Z</span>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-foreground">Famous Stars</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Tap to see their top movies. {TMDB_ACTRESSES.length}+ stars listed.</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
          {TMDB_ACTRESSES.map((actress) => (
            <Link
              key={actress.id}
              to={`/actress/${actress.id}`}
              className="group relative flex flex-col items-center gap-1.5 rounded-lg p-2 sm:p-3 bg-card hover:bg-muted transition-all duration-200"
            >
              <div className="relative size-16 sm:size-20 md:size-24 overflow-hidden rounded-full bg-muted">
                <img
                  src={`https://image.tmdb.org/t/p/w185${actress.img}`}
                  alt={actress.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-foreground text-center line-clamp-2 leading-tight">
                {actress.name}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <DNAFooter />
    </div>
  );
};

export default ActressesPage;
