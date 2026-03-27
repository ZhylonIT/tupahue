import { Box } from '@mui/material';
import { HeroSlider } from './HeroSlider.jsx';
import { FloatingNews } from './FloatingNews';

export const HeroHome = () => {
  return (
    <Box sx={{ position: 'relative', mb: { xs: 16, md: 20 } }}>
      <HeroSlider />
      <FloatingNews />

    </Box>
  );
};