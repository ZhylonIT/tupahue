import { 
  ChildCare, 
  DirectionsRun, 
  SelfImprovement, 
  Star, 
  MilitaryTech, 
  EmojiEvents, 
  WorkspacePremium,
  Psychology,
  Handyman,
  Explore,
  Groups,
  Terrain,      // Importado para la etapa Tierra
  Whatshot,     // Importado para la etapa Fuego
  Air,          // Importado para la etapa Aire
  Water,        // Importado para la etapa Agua
  Handshake,    // Importado para la etapa Compromiso
  TrendingUp,   // Importado para la etapa Proyección
  Logout        // Importado para la etapa Partida
} from '@mui/icons-material';

export const RAMAS = {
  LOBATOS: {
    id: 'LOBATOS',
    nombre: 'Lobatos y Lobeznas',
    color: '#FFD600',
    colorFondo: 'rgba(255, 214, 0, 0.1)',
    proximaRama: 'SCOUTS',
    rangoEtario: '7 a 10 años',
    etapas: [
      { id: 'pata_tierna', nombre: 'Pata Tierna', color: '#BDBDBD', icon: ChildCare }, 
      { id: 'saltador', nombre: 'Saltador', color: '#4CAF50', icon: DirectionsRun },
      { id: 'rastreador', nombre: 'Rastreador', color: '#2196F3', icon: SelfImprovement },
      { id: 'cazador', nombre: 'Cazador', color: '#FF9800', icon: Star }
    ]
  },
  SCOUTS: {
    id: 'SCOUTS',
    nombre: 'Scout',
    color: '#2E7D32',
    colorFondo: 'rgba(46, 125, 50, 0.1)',
    proximaRama: 'CAMINANTES',
    rangoEtario: '10 a 14 años',
    etapas: [
      { id: 'pista', nombre: 'Pista', color: '#9E9E9E', icon: Explore },
      { id: 'senda', nombre: 'Senda', color: '#4CAF50', icon: DirectionsRun },
      { id: 'rumbo', nombre: 'Rumbo', color: '#2196F3', icon: Explore },
      { id: 'travesia', nombre: 'Travesía', color: '#FF9800', icon: EmojiEvents }
    ]
  },
  CAMINANTES: {
    id: 'CAMINANTES',
    nombre: 'Caminantes',
    color: '#0ee2e5',
    colorFondo: '#0ee1e517',
    proximaRama: 'ROVERS',
    rangoEtario: '14 a 18 años',
    etapas: [
      { id: 'tierra', nombre: 'Tierra', color: '#BDBDBD', icon: Terrain },
      { id: 'fuego', nombre: 'Fuego', color: '#F44336', icon: Whatshot },
      { id: 'aire', nombre: 'Aire', color: '#2196F3', icon: Air },
      { id: 'agua', nombre: 'Agua', color: '#0ee2e5', icon: Water }
    ]
  },
  ROVERS: {
    id: 'ROVERS',
    nombre: 'Rover',
    color: '#C62828',
    colorFondo: 'rgba(198, 40, 40, 0.1)',
    proximaRama: 'EDUCADORES', // Actualizado según tu pedido para reflejar el pase a educador
    rangoEtario: '18 a 22 años',
    etapas: [
      { id: 'encuentro', nombre: 'Encuentro', color: '#BDBDBD', icon: Groups },
      { id: 'compromiso', nombre: 'Compromiso', color: '#FF9800', icon: Handshake },
      { id: 'proyeccion', nombre: 'Proyección', color: '#2196F3', icon: TrendingUp },
      { id: 'partida', nombre: 'Partida', color: '#C62828', icon: Logout }
    ]
  }
};

export const ROLES_GESTION = {
  JEFE_GRUPO: { id: 'jefe', nombre: 'Jefatura de Grupo', color: '#212121' },
  PROGRAMA: { id: 'programa', nombre: 'Asistente PJ', color: '#1976D2' },
  FINANZAS: { id: 'finanzas', nombre: 'Asistente AYF', color: '#388E3C' },
  COMUNICACIONES: { id: 'comunicaciones', nombre: 'Asistente CI', color: '#F57C00' },
  ADULTOS: { id: 'adultos', nombre: 'Asistente AMS', color: '#D32F2F' }
};