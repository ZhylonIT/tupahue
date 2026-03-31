import { useState, useMemo } from 'react';
import { Drawer } from '@mui/material';
import { 
  Dashboard, People, BarChart, Event as EventIcon, 
  FolderShared, AccountBalanceWallet, Campaign, 
  AdminPanelSettings, Engineering, School,
  Assignment, Payments, AccountBalance, WorkspacePremium 
} from '@mui/icons-material';
import { RAMAS } from '../../constants/ramas.jsx';
import { FUNCIONES } from '../../constants/auth.jsx';

import { SidebarHeader } from './SidebarHeader';
import { BranchSelector } from './BranchSelector';
import { NavMenu } from './NavMenu';
import { UserFooter } from './UserFooter';

const drawerWidth = 280;

// Definimos los colores y fondos para las funciones de gestión
const COLORES_GESTION = {
  [FUNCIONES.JEFE_GRUPO]: { color: '#8e44ad', fondo: 'rgba(142, 68, 173, 0.15)' },
  [FUNCIONES.ASISTENTE_PROG]: { color: '#e67e22', fondo: 'rgba(230, 126, 34, 0.15)' },
  [FUNCIONES.ASISTENTE_ADULTOS]: { color: '#c0392b', fondo: 'rgba(192, 57, 43, 0.15)' },
  [FUNCIONES.ASISTENTE_COM]: { color: '#1a5276', fondo: 'rgba(26, 82, 118, 0.15)' },
  [FUNCIONES.ASISTENTE_ADM]: { color: '#1b5e20', fondo: 'rgba(27, 94, 32, 0.15)' },
};

const getRoleIcon = (func) => {
  if (func === FUNCIONES.JEFE_GRUPO) return <AdminPanelSettings sx={{ fontSize: 20 }} />;
  if (func?.startsWith('ASISTENTE_')) return <Engineering sx={{ fontSize: 20 }} />;
  return <School sx={{ fontSize: 20 }} />;
};

const getCargoLabel = (func) => {
  const nombres = {
    [FUNCIONES.JEFE_GRUPO]: "Jefe de Grupo",
    [FUNCIONES.ASISTENTE_PROG]: "Asistente de Programa",
    [FUNCIONES.ASISTENTE_ADM]: "Asistente de Administración",
    [FUNCIONES.ASISTENTE_ADULTOS]: "Asistente de Adultos",
    [FUNCIONES.ASISTENTE_COM]: "Asistente de Comunicaciones"
  };
  return nombres[func] || `Educador ${RAMAS[func?.toUpperCase()]?.nombre || "Rama"}`;
};

export const Sidebar = ({ 
  ramaSeleccionada, 
  onRamaChange, 
  vistaActual, 
  setVistaActual, 
  canChangeRama = false, 
  userFuncion 
}) => {
  const [open, setOpen] = useState(true);

  // Funciones que activan el modo "Gestión" (Vista Global)
  const funcionesGestion = Object.keys(COLORES_GESTION);
  const tienePermisoGlobal = useMemo(() => funcionesGestion.includes(userFuncion), [userFuncion]);

  const config = useMemo(() => {
    if (COLORES_GESTION[userFuncion]) return COLORES_GESTION[userFuncion];
    const ramaData = RAMAS[ramaSeleccionada?.toUpperCase()] || RAMAS.CAMINANTES;
    return { color: ramaData.color, fondo: ramaData.colorFondo };
  }, [userFuncion, ramaSeleccionada]);

  const menuItems = useMemo(() => {
    const items = [{ id: 'dashboard', label: 'Inicio', icon: <Dashboard />, vista: 'DASHBOARD' }];

    const esJefe = userFuncion === FUNCIONES.JEFE_GRUPO;
    const esAsistenteAdm = userFuncion === FUNCIONES.ASISTENTE_ADM;
    const esAsistenteAdultos = userFuncion === FUNCIONES.ASISTENTE_ADULTOS;
    const esAsistenteProg = userFuncion === FUNCIONES.ASISTENTE_PROG;
    const esEducadorDeRama = [FUNCIONES.LOBATOS, FUNCIONES.SCOUTS, FUNCIONES.CAMINANTES, FUNCIONES.ROVERS].includes(userFuncion);

    if (esJefe || esEducadorDeRama || esAsistenteProg) {
      items.push(
        { id: 'nomina', label: esJefe || esAsistenteProg ? 'Nómina Global' : 'Mi Rama', icon: <People />, vista: esJefe || esAsistenteProg ? 'NOMINA_GLOBAL' : 'NOMINA' },
        { id: 'progresion', label: 'Progresión', icon: <BarChart />, vista: 'PROGRESION' },
        { id: 'planificaciones', label: 'Planificaciones', icon: <Assignment />, vista: 'PLANIFICACIONES' }
      );
    }

    if (esJefe || esAsistenteAdultos) {
      items.push({ id: 'adultos', label: 'Gestión de Adultos', icon: <WorkspacePremium />, vista: 'ADULTOS' });
    }

    if (esJefe || esAsistenteAdm) {
      items.push(
        { id: 'finanzas', label: 'Caja del Grupo', icon: <AccountBalanceWallet />, vista: 'FINANZAS' },
        { id: 'cuotas', label: 'Estado de Cuotas', icon: <Payments />, vista: 'CUOTAS' },        
        { id: 'presupuesto', label: 'Presupuesto Anual', icon: <AccountBalance />, vista: 'PRESUPUESTO' }
      );
    }

    if (esJefe || userFuncion === FUNCIONES.ASISTENTE_COM) {
      items.push({ id: 'noticias', label: 'Panel de noticias', icon: <Campaign />, vista: 'NOTICIAS' });
    }

    items.push({ id: 'calendario', label: 'Calendario', icon: <EventIcon />, vista: 'CALENDARIO' });
    
    if (esJefe || esEducadorDeRama || esAsistenteAdm) {
      items.push({ id: 'documentos', label: 'Legajos', icon: <FolderShared />, vista: 'DOCUMENTOS' });
    }

    return items;
  }, [userFuncion]);

  // REGLA DE ORO: Sincronización estricta al cambiar el rol
  const handleRoleSwitched = (nuevaFuncion) => {
    // 1. Si la nueva función es JEFE o PROG, pueden navegar, pero los llevamos a TODAS por inicio
    // 2. Si es Asistente Técnico (Adm, Adultos, Com), los llevamos a TODAS y quedarán bloqueados por 'canChangeRama'
    if (funcionesGestion.includes(nuevaFuncion)) {
      onRamaChange('TODAS');
    } else {
      // 3. Si es un educador volviendo a su rama, lo llevamos a su rama específica
      onRamaChange(nuevaFuncion.toUpperCase());
    }
    
    // Reset visual para evitar inconsistencias
    setVistaActual('DASHBOARD');
  };

  return (
    <Drawer 
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 70, 
        transition: 'width 0.3s',
        '& .MuiDrawer-paper': { 
          width: open ? drawerWidth : 70, 
          transition: 'width 0.3s', 
          overflowX: 'hidden', 
          bgcolor: '#1a1a1a', 
          color: 'white', 
          borderRight: 'none' 
        },
      }}
    >
      <SidebarHeader open={open} setOpen={setOpen} configColor={config.color} />
      
      {/* canChangeRama viene del DashboardPage y bloqueará el selector para los técnicos */}
      <BranchSelector 
        open={open} 
        tienePermisoGlobal={tienePermisoGlobal} 
        canChangeRama={canChangeRama} 
        ramaSeleccionada={ramaSeleccionada} 
        onRamaChange={onRamaChange} 
        userFuncion={userFuncion} 
      />
      
      <NavMenu open={open} items={menuItems} vistaActual={vistaActual} setVistaActual={setVistaActual} config={config} />
      
      <UserFooter 
        open={open} 
        userFuncion={userFuncion} 
        config={config} 
        getRoleIcon={getRoleIcon} 
        getCargoLabel={getCargoLabel}
        onRoleSwitched={handleRoleSwitched} 
      />
    </Drawer>
  );
};