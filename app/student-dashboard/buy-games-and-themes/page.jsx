"use client";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Collapse,
  Dialog,
  DialogContent,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";
import PaletteIcon from "@mui/icons-material/Palette";
import LockIcon from "@mui/icons-material/Lock";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { styled } from "@mui/material/styles";

const headingFont = "'Jaldi', sans-serif";

const DiscoveryCard = styled(Card)(({ theme }) => ({
  position: "relative",
  background: "#fff",
  borderRadius: 32,
  transition: "all 0.3s",
  cursor: "pointer",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 24px 48px rgba(255, 202, 10, 0.53)",
  },
  "&:active": {
    transform: "translateY(-4px)",
  },
}));

const InteractiveChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: 16,
  right: 16,
  zIndex: 1,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
}));

const ThemeToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  margin: "24px auto",
  "& .MuiToggleButton-root": {
    borderRadius: "24px!important",
    padding: "8px 24px",
    border: "2px solidrgb(248, 181, 56)!important",
    "&.Mui-selected": {
      background: "linear-gradient(135deg,rgb(245, 162, 29) 0%,rgb(243, 210, 23) 100%)",
      color: "#fff",
    },
  },
}));

const ColorSwatch = styled(Box)(({ color }) => ({
  width: 60,
  height: 60,
  borderRadius: 16,
  backgroundColor: color,
  cursor: "pointer",
  transition: "all 0.3s",
  "&:hover": {
    transform: "scale(1.1) rotate(8deg)",
    boxShadow: `0 0 24px ${color}40`,
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const ImageContainer = styled(Box)(({ unlocked }) => ({
  position: "relative",
  filter: unlocked ? "none" : "blur(6px) grayscale(80%)",
  transition: "filter 0.3s",
  "&:hover": {
    filter: "none",
  },
}));

const EyeOverlay = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 12,
  left: 12,
  backgroundColor: "#ffffffcc",
  backdropFilter: "blur(4px)",
  zIndex: 2,
  "&:hover": {
    backgroundColor: "#ffffffee",
  },
}));

const themes = [
  {
    id: "sea",
    title: "🌊 Sea Theme",
    requiredPoints: 3000,
    warning: "This will deduct 3000 points from your account",
    image: "/images/seeTheme.png",
    palette: ["#23577C", "#369CA1", "#56C49C", "#85ED9C", "#CEFDD4"],
    hints: ["Look for glowing elements", "Try double-clicking color swatches"],
  },
  {
    id: "space",
    title: "🚀 Space Theme",
    requiredPoints: 5000,
    warning: "This will deduct 5000 points from your account",
    image: "/images/spaceTheme.png",
    palette: ["#C0D8D6", "#F4D3CB", "#E187D2", "#8A38AE", "#412040"],
    hints: ["Hover over the lock icon", "Check for hidden animations"],
  },
];

export default function ThemesPage() {
  const [points, setPoints] = useState(0);
  const [filter, setFilter] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [expandedPalette, setExpandedPalette] = useState({});
  const [showDetails, setShowDetails] = useState({});
  
  useEffect(() => {
    const storedPoints = Cookies.get("currentUserPoints");
    if (storedPoints) setPoints(parseInt(storedPoints));
  }, []);

  const handleColorCopy = (color) => {
    navigator.clipboard.writeText(color);
  };

  const handleFilterChange = (e, newFilter) => {
    if (newFilter) setFilter(newFilter);
  };

  const togglePalette = (id) => {
    setExpandedPalette((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleHint = (id) => {
    setShowDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredThemes = themes.filter((theme) => {
    if (filter === "unlocked") return points >= theme.requiredPoints;
    if (filter === "locked") return points < theme.requiredPoints;
    return true;
  });

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: "linear-gradient(135deg, #f7f6f3 60%, #e0f7fa 100%)",
        minHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <Box sx={{ position: "relative", textAlign: "center", mb: 4 }}>
        <InteractiveChip
          icon={<StarBorderIcon />}
          label={`${points} Points`}
          color="primary"
        />
        <Typography
          variant="h3"
          sx={{
            fontFamily: headingFont,
            background: "linear-gradient(135deg,rgb(250, 153, 57) 0%,rgb(238, 52, 52) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 4px 24pxrgb(255, 220, 174)",
          }}
        >
          ✨ Theme Explorer ✨
        </Typography>
      </Box>

      <ThemeToggleGroup value={filter} exclusive onChange={handleFilterChange}>
        <ToggleButton value="all">All Themes</ToggleButton>
        <ToggleButton value="unlocked">Unlocked</ToggleButton>
        <ToggleButton value="locked">Locked</ToggleButton>
      </ThemeToggleGroup>

      <Grid container spacing={4} justifyContent="center">
        {filteredThemes.map((theme) => {
          const unlocked = points >= theme.requiredPoints;
          return (
            <Grid item xs={12} md={6} key={theme.id}>
              <DiscoveryCard>
                <InteractiveChip
                  icon={unlocked ? <PaletteIcon /> : <LockIcon />}
                  label={unlocked ? "Unlocked" : "Locked"}
                  color={unlocked ? "success" : "warning"}
                />
                <ImageContainer unlocked={unlocked}>
                  <CardMedia
                    component="img"
                    image={theme.image}
                    alt={theme.title}
                    sx={{
                      height: 260,
                      objectFit: "cover",
                      opacity: 0.8,
                    }}
                  />
                  <EyeOverlay>
                    <VisibilityIcon />
                  </EyeOverlay>
                </ImageContainer>

                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontFamily: headingFont }}>
                      {theme.title}
                    </Typography>
                    <Tooltip title="Theme hints">
                      <IconButton onClick={() => toggleHint(theme.id)}>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Show Palette">
                      <IconButton onClick={() => togglePalette(theme.id)}>
                        <PaletteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Collapse in={showDetails[theme.id]}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      {theme.hints.map((hint, i) => (
                        <div key={i}>🔍 {hint}</div>
                      ))}
                    </Alert>
                  </Collapse>

                  <Collapse in={expandedPalette[theme.id]}>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      {theme.palette.map((color, i) => (
                        <Grid item key={i}>
                          <Tooltip title={`Click to copy ${color}`}>
                            <ColorSwatch
                              color={color}
                              onClick={() => handleColorCopy(color)}
                            />
                          </Tooltip>
                        </Grid>
                      ))}
                    </Grid>
                  </Collapse>

                  {unlocked ? (
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette[0]}, ${theme.palette[3]})`,
                        color: "#fff",
                        borderRadius: 3,
                        py: 1.3,
                      }}
                    >
                      Activate Theme
                    </Button>
                  ) : (
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                      Need {theme.requiredPoints - points} more points to unlock
                    </Alert>
                  )}
                </CardContent>
              </DiscoveryCard>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={!!selectedTheme} onClose={() => setSelectedTheme(null)}>
        <DialogContent>
          {selectedTheme && (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                {selectedTheme.title}
              </Typography>
              <Typography>
                Are you sure you want to activate this theme?
              </Typography>
              <Button
                sx={{ mt: 3 }}
                onClick={() => {
                  setSelectedTheme(null);
                  setPoints((prev) => prev - selectedTheme.requiredPoints);
                }}
              >
                Confirm Activation
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
