"use client";
import { useState, useEffect } from "react";
import {
  Typography, Container, Card, CardContent, Grid, CardActionArea, Pagination,
  Box, Skeleton, Button, Chip, TextField, MenuItem, Select, FormControl,
  InputLabel, InputAdornment, IconButton
} from "@mui/material";
import Link from "next/link";
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import ShuffleIcon from '@mui/icons-material/Shuffle';

// ข้อมูลสีประจำธาตุ
const typeColors: { [key: string]: string } = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD',
};

const allTypes = Object.keys(typeColors);
const legendaryKeywords = ["mewtwo", "mew", "articuno", "zapdos", "moltres", "lugia", "ho-oh", "kyogre", "groudon", "rayquaza", "jirachi", "deoxys", "dialga", "palkia", "giratina", "arceus", "xerneas", "yveltal", "zygarde", "zacian", "zamazenta", "eternatus", "koraidon", "miraidon"];

export default function Home() {
  const [allPokemon, setAllPokemon] = useState<{name: string, url: string}[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<{name: string, url: string}[]>([]);
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/?limit=2000`)
      .then(res => res.json())
      .then(data => setAllPokemon(data.results));
  }, []);

  useEffect(() => {
    const filterData = async () => {
      let baseList = allPokemon;
      if (selectedType !== "all") {
        setLoading(true);
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
          const data = await res.json();
          baseList = data.pokemon.map((p: any) => p.pokemon);
        } catch (error) { console.error("Filter error:", error); }
      }
      if (selectedTier !== "all") {
        if (selectedTier === "legendary") baseList = baseList.filter(p => legendaryKeywords.some(leg => p.name.includes(leg)));
        else if (selectedTier === "mega") baseList = baseList.filter(p => p.name.includes("-mega"));
        else if (selectedTier === "basic") baseList = baseList.filter(p => !p.name.includes("-mega") && !legendaryKeywords.some(leg => p.name.includes(leg)));
      }
      if (searchTerm) baseList = baseList.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredPokemon(baseList);
      setPage(1); 
    };
    if (allPokemon.length > 0) filterData();
  }, [searchTerm, selectedType, selectedTier, allPokemon]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const slice = filteredPokemon.slice((page-1)*itemsPerPage, page*itemsPerPage);
      const details = await Promise.all(slice.map(async p => {
          const id = parseInt(p.url.split('/')[6]);
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const data = await res.json();
          return { id, name: p.name, types: data.types.map((t:any) => t.type.name) };
      }));
      setPokemonList(details);
      setLoading(false);
    };
    fetchDetails();
  }, [page, filteredPokemon]);

  const handleRandomDraw = () => {
    if (allPokemon.length > 0) {
        const random = allPokemon[Math.floor(Math.random() * allPokemon.length)];
        window.location.href = `/pokemon/${random.name}`;
    }
  };

  return (
    <Box sx={{ bgcolor: "#F5F5F5", minHeight: "100vh", pb: 6 }}>
      {/* Header พร้อมปุ่มจัดวางใหม่ */}
      <Box sx={{ bgcolor: "#EE1515", py: 4, position: "relative", borderBottom: "8px solid #222", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
        
        {/* ปุ่มสุ่มการ์ด - ซ้ายบน */}
        <Button variant="contained" startIcon={<ShuffleIcon />} onClick={handleRandomDraw} 
          sx={{ position: "absolute", left: 16, top: 16, bgcolor: "#FFCB05", color: "#EE1515", fontWeight: "bold", borderRadius: 3, boxShadow: 3, "&:hover": { bgcolor: "#F2C94C" } }}>
          สุ่มการ์ด
        </Button>

        {/* ปุ่มเกี่ยวกับโปรเจค - ขวาบน */}
        <Button component={Link} href="/about" variant="contained" startIcon={<InfoIcon />} 
          sx={{ position: "absolute", right: 16, top: 16, bgcolor: "#FFCB05", color: "#EE1515", fontWeight: "bold", borderRadius: 3, boxShadow: 3, "&:hover": { bgcolor: "#F2C94C" } }}>
          เกี่ยวกับโปรเจค
        </Button>

        <Container sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ fontFamily: "'Press Start 2P', 'Kanit', cursive", color: "#FFCB05", WebkitTextStroke: "1.5px #FFFFFF", textShadow: "3px 3px 0px #222222", fontWeight: "bold", mt: 2 }}>
            Pokemon Directory
          </Typography>
        </Container>
      </Box>

      <Container sx={{ mt: 5 }}>
        {/* ช่องค้นหาและฟิลเตอร์ */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 4, bgcolor: "#FFFFFF", p: 3, borderRadius: 4, boxShadow: "0px 4px 10px rgba(0,0,0,0.05)", border: "2px solid #E0E0E0" }}>
          <TextField fullWidth placeholder="ค้นหาชื่อโปเกม่อน..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ flex: 2 }} slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: "#EE1515" }} /></InputAdornment>), sx: { borderRadius: 3, bgcolor: "#F9F9F9" } } }} />
          <FormControl fullWidth sx={{ flex: 1 }}><InputLabel>ธาตุ (Type)</InputLabel><Select value={selectedType} label="ธาตุ (Type)" onChange={(e) => setSelectedType(e.target.value)} sx={{ borderRadius: 3, bgcolor: "#F9F9F9" }}><MenuItem value="all">ธาตุทั้งหมด</MenuItem>{allTypes.map((type) => (<MenuItem key={type} value={type} sx={{ textTransform: "capitalize" }}><Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: typeColors[type] }} />{type}</Box></MenuItem>))}</Select></FormControl>
          <FormControl fullWidth sx={{ flex: 1 }}><InputLabel>ระดับ (Tier)</InputLabel><Select value={selectedTier} label="ระดับ (Tier)" onChange={(e) => setSelectedTier(e.target.value)} sx={{ borderRadius: 3, bgcolor: "#F9F9F9", fontWeight: "bold" }}><MenuItem value="all">ระดับทั้งหมด</MenuItem><MenuItem value="basic">ทั่วไป (Basic)</MenuItem><MenuItem value="legendary">ตำนาน / มายา (Legendary) ✨</MenuItem><MenuItem value="mega">ร่างเมก้า (Mega Evolution)</MenuItem></Select></FormControl>
        </Box>

        {/* แสดงรายการโปเกม่อน */}
        <Grid container spacing={3}>
          {loading ? Array.from(new Array(itemsPerPage)).map((_, i) => <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}><Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} /></Grid>)
          : pokemonList.map((pokemon) => {
            const mainColor = typeColors[pokemon.types[0] || "normal"] || "#E0E0E0";
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={pokemon.id}>
                <Card sx={{ borderRadius: 4, border: `5px solid ${mainColor}`, background: `linear-gradient(to bottom, ${mainColor}33 0%, #ffffff 60%)`, transition: "0.2s", "&:hover": { transform: "translateY(-8px)" } }}>
                  <CardActionArea component={Link} href={`/pokemon/${pokemon.name}`}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Box component="img" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} onError={(e:any) => e.currentTarget.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"} sx={{ width: 100, height: 100, borderRadius: "50%", border: `2px solid ${mainColor}66` }} />
                      <Typography fontWeight="bold" sx={{ mt: 1 }}>{pokemon.name}</Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>{pokemon.types.map((type:string) => (<Chip key={type} label={type} size="small" sx={{ bgcolor: typeColors[type], color: "white", fontSize: "0.7rem" }} />))}</Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Pagination count={Math.ceil(filteredPokemon.length / itemsPerPage)} page={page} onChange={(e, value) => setPage(value)} />
        </Box>
      </Container>
    </Box>
  );
}