"use client";
import { use, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  Box,
  Skeleton,
  Chip,
  Button,
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface PokemonData {
  name: string;
  sprites: { other: { "official-artwork": { front_default: string } } };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  cries?: { latest: string };
  species?: { url: string };
}

const typeColors: { [key: string]: string } = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD',
};

export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ pokemonname: string }>;
}) {
  const { pokemonname } = use(params);
  const [data, setData] = useState<PokemonData | null>(null);
  const [evolutions, setEvolutions] = useState<string[]>([]);
  const [isRare, setIsRare] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonname}`);
        const pkmnData: PokemonData = await res.json();
        setData(pkmnData);

        // ดักจับ Error กรณีไม่มีข้อมูลเผ่าพันธุ์ (Species) หรือสายวิวัฒนาการ
        let evoChain: string[] = [pkmnData.name];
        let rareStatus = false;

        if (pkmnData.species && pkmnData.species.url) {
          try {
            const speciesRes = await fetch(pkmnData.species.url);
            const speciesData = await speciesRes.json();

            // เช็คความหายาก
            if (speciesData.is_legendary || speciesData.is_mythical) {
              rareStatus = true;
            }

            if (speciesData.evolution_chain && speciesData.evolution_chain.url) {
              const evoRes = await fetch(speciesData.evolution_chain.url);
              const evoData = await evoRes.json();
              
              evoChain = [];
              let evoNode = evoData.chain;
              do {
                if (evoNode && evoNode.species) {
                  evoChain.push(evoNode.species.name);
                }
                evoNode = evoNode.evolves_to && evoNode.evolves_to.length > 0 ? evoNode.evolves_to[0] : null;
              } while (evoNode);
            }
          } catch (e) {
            console.warn("Evolution data not found for this pokemon");
          }
        }

        // เช็คพลังโจมตี
        const attackStat = pkmnData.stats?.find(s => s.stat.name === 'attack')?.base_stat || 0;
        if (attackStat >= 100) rareStatus = true;

        setIsRare(rareStatus);
        setEvolutions(evoChain);

      } catch (error) {
        console.error("Error fetching pokemon details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [pokemonname]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <Skeleton variant="rectangular" width={400} height={650} sx={{ borderRadius: 4 }} />
      </Container>
    );
  }

  if (!data) return <Typography align="center" sx={{ mt: 5 }}>ไม่พบข้อมูลโปเกม่อน</Typography>;

  const hpStat = data.stats?.find((s) => s.stat.name === "hp")?.base_stat || 0;
  
  // ป้องกันบัค Undefined type (เช็คก่อนดึงข้อมูล)
  const primaryType = data.types && data.types.length > 0 ? data.types[0].type.name : "normal";
  const mainColor = typeColors[primaryType] || "#F2C94C";
  const imageUrl = data.sprites?.other?.["official-artwork"]?.front_default || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Button 
        component={Link} 
        href="/" 
        variant="contained" 
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, bgcolor: "#3B4CCA", "&:hover": { bgcolor: "#2a3696" } }}
      >
        กลับไปหน้าแรก
      </Button>

      <Card 
        sx={{ 
          borderRadius: "16px", 
          border: isRare ? "12px solid #FFD700" : `12px solid ${mainColor}`, 
          background: `linear-gradient(to bottom, ${mainColor}44 0%, #F9F9F9 40%, #FFFFFF 100%)`, 
          boxShadow: isRare 
            ? `0px 0px 30px ${mainColor}, 0px 0px 60px ${mainColor}80, inset 0px 0px 20px rgba(255, 215, 0, 0.5)`
            : "0px 10px 30px rgba(0, 0, 0, 0.3)",
          p: 2,
          position: "relative",
          maxWidth: 420,
          mx: "auto",
          overflow: "visible",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `2px solid ${mainColor}80`, pb: 1, mb: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: "bold", color: "#666", fontStyle: "italic" }}>
              {isRare ? "✨ ระดับตำนาน / พลังโจมตีสูง" : "พื้นฐาน (Basic)"}
            </Typography>
            <Typography variant="h5" sx={{ textTransform: "capitalize", fontWeight: "bold", fontFamily: "'Kanit', sans-serif" }}>
              {data.name}
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#CC0000", textShadow: isRare ? "1px 1px 2px rgba(0,0,0,0.3)" : "none" }}>
            <Typography component="span" variant="subtitle2" sx={{ mr: 0.5, color: "#CC0000" }}>HP</Typography>
            {hpStat}
          </Typography>
        </Box>

        <Box 
          sx={{ 
            border: isRare ? "5px solid #FFD700" : "5px solid #B0B0B0",
            boxShadow: isRare ? "0px 0px 15px rgba(255,215,0,0.6)" : "inset 0px 0px 10px rgba(0,0,0,0.2)",
            backgroundImage: isRare 
              ? `linear-gradient(135deg, rgba(255,255,255,0.8) 0%, ${mainColor}33 25%, rgba(255,0,255,0.2) 50%, ${mainColor}33 75%, rgba(255,215,0,0.4) 100%)`
              : `linear-gradient(to bottom, ${mainColor}22, #f0fdf4)`,
            borderRadius: "4px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 250,
            mb: 1,
            position: "relative"
          }}
        >
          <Box 
            component="img"
            src={imageUrl} 
            alt={data.name} 
            onError={(e: any) => { e.currentTarget.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"; }}
            sx={{ 
              width: "85%", 
              height: "85%", 
              objectFit: "contain", 
              filter: isRare ? "drop-shadow(0px 0px 10px rgba(255,255,255,0.8)) drop-shadow(4px 6px 6px rgba(0,0,0,0.4))" : "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))",
              zIndex: 2
            }} 
          />
        </Box>

        <Box sx={{ bgcolor: `${mainColor}33`, py: 0.5, px: 1, borderRadius: 1, display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: "bold", color: "#333" }}>
            Types:
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {data.types && data.types.map((t) => (
              <Chip 
                key={t.type.name} 
                label={t.type.name} 
                size="small" 
                sx={{ textTransform: "capitalize", fontSize: "0.7rem", height: 20, fontWeight: "bold", bgcolor: typeColors[t.type.name] || "#777", color: "white" }} 
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ minHeight: 120 }}>
          {data.stats && data.stats.filter(s => s.stat.name !== "hp").map((s) => {
            const isHighStat = s.base_stat >= 100;
            return (
              <Box key={s.stat.name} sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.1)", py: 0.5 }}>
                <Typography variant="body2" sx={{ textTransform: "capitalize", fontWeight: "bold", color: "#333" }}>
                  {s.stat.name.replace("-", " ")}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "1.1rem", color: isHighStat ? "#CC0000" : "#222" }}>
                  {s.base_stat}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ mt: 2, borderTop: `2px solid ${mainColor}80`, pt: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: "bold", display: "block", mb: 1 }}>
            Evolution Chain:
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
            {evolutions.length > 0 ? evolutions.map((evo, index) => (
              <Box key={evo} sx={{ display: "flex", alignItems: "center" }}>
                <Chip
                  component={Link}
                  href={`/pokemon/${evo}`}
                  label={evo}
                  size="small"
                  sx={{ 
                    textTransform: "capitalize", 
                    cursor: "pointer",
                    bgcolor: evo === data.name ? mainColor : "rgba(0,0,0,0.1)",
                    color: evo === data.name ? "white" : "inherit",
                    fontWeight: evo === data.name ? "bold" : "normal"
                  }}
                />
                {index < evolutions.length - 1 && <Typography variant="caption" sx={{ mx: 0.5 }}>{">"}</Typography>}
              </Box>
            )) : (
              <Typography variant="caption" color="text.secondary">No evolution data</Typography>
            )}
          </Box>

          <Typography variant="caption" sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}>
            Cry:
          </Typography>
          {data.cries && data.cries.latest ? (
            <audio controls src={data.cries.latest} style={{ width: "100%", height: 30 }}>
              Your browser does not support the audio element.
            </audio>
          ) : (
             <Typography variant="caption" color="text.secondary">No audio available</Typography>
          )}
        </Box>
      </Card>
    </Container>
  );
}