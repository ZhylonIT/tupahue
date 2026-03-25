import { Box } from '@mui/material';
const COLORES = [
  '#FFD000',
  '#008000',
  '#87CEEB',
  '#FF0000' 
];

export const CintasPanuelo = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        width: '100%', 
        height: '6px', // Grosor de las cintas
        overflow: 'hidden',        
        lineHeight: 0 
      }}
    >
      {COLORES.map((color, index) => (
        <Box 
          key={index} 
          sx={{ 
            flex: 1, 
            bgcolor: color, 
            height: '100%' 
          }} 
        />
      ))}
    </Box>
  );
};