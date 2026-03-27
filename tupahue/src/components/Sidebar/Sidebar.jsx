import { useState, useMemo } from 'react';
import { Drawer } from '@mui/material';
import { 
  Dashboard, People, BarChart, Event as EventIcon, 
  FolderShared, AccountBalanceWallet, Campaign, 
  AdminPanelSettings, Engineering, School,
  Assignment 
} from '@mui/icons-material';
import { RAMAS } from '../../constants/ramas.jsx';
import { FUNCIONES } from '../../constants/auth.jsx';

import { SidebarHeader } from './SidebarHeader';
import { BranchSelector } from './BranchSelector';
import { NavMenu } from './NavMenu';
import { UserFooter } from './UserFooter';

const drawerWidth = 280;

const COLORES_GESTION = {
  [FUNCIONES.JEFE_GRUPO]: { color: '#8e44ad', fondo: 'rgba(142, 68, 173, 0.15)' },
  [FUNCIONES.ASISTENTE_PROG]: { color: '#e67e22', fondo: 'rgba(230, 126, 34, 0.15)' },
  [FUNCIONES.ASISTENTE_ADULTOS]: { color: '#c0392b', fondo: 'rgba(192, 57, 43, 0.15)' },
  [FUNCIONES.ASISTENTE_COM]: { color: '#1a5276', fondo: 'rgba(26, 82, 118, 0.15)' },
  [FUNCIONES.ASISTENTE_ADM]: { color: '#1b5e20', fondo: 'rgba(27, 94, 32, 0.15)' },
};

const getRoleIcon = (func) => {
  if (func === FUNCIONES.JEFE_GRUPO) return <AdminPanelSettings sx={{ fontSize: 20 }} />;
  if (func.startsWith('ASISTENTE_')) return <Engineering sx={{ fontSize: 20 }} />;
  return <School sx={{ fontSize: 20 }} />;
};

const getCargoLabel = (func) => {
  const nombres = {
    [FUNCIONES.JEFE_GRUPO]: "Jefe de Grupo",
    [FUNCIONES.ASISTENTE_PROG]: "Asistente de Prog.",
    [FUNCIONES.ASISTENTE_ADM]: "Asistente de Adm.",
    [FUNCIONES.ASISTENTE_ADULTOS]: "Asistente de Adultos",
    [FUNCIONES.ASISTENTE_COM]: "Asistente de Com."
  };
  return nombres[func] || `Educador ${RAMAS[func.toUpperCase()]?.nombre || "Rama"}`;
};

export const Sidebar = ({ ramaSeleccionada, onRamaChange, vistaActual, setVistaActual, canChangeRama = false, userFuncion, onFuncionChange }) => {
  const [open, setOpen] = useState(true);

  const tienePermisoGlobal = useMemo(() => Object.keys(COLORES_GESTION).includes(userFuncion), [userFuncion]);

  const config = useMemo(() => {
    if (COLORES_GESTION[userFuncion]) return { color: COLORES_GESTION[userFuncion].color, fondo: COLORES_GESTION[userFuncion].fondo };
    const ramaData = RAMAS[ramaSeleccionada?.toUpperCase()] || RAMAS.CAMINANTES;
    return { color: ramaData.color, fondo: ramaData.colorFondo };
  }, [userFuncion, ramaSeleccionada]);

  const menuItems = useMemo(() => {
    // 1. Items base que todos ven
    const items = [
      { id: 'dashboard', label: 'Inicio', icon: <Dashboard />, vista: 'DASHBOARD' }
    ];

    const esJefe = userFuncion === FUNCIONES.JEFE_GRUPO;

    // --- Lógica para Educadores de Rama y Asistente de Programa ---
    const esEducadorDeRama = [
      FUNCIONES.LOBATOS, 
      FUNCIONES.SCOUTS, 
      FUNCIONES.CAMINANTES, 
      FUNCIONES.ROVERS
    ].includes(userFuncion);
    
    const esAsistenteProg = userFuncion === FUNCIONES.ASISTENTE_PROG;

    if (esJefe || esEducadorDeRama || esAsistenteProg) {
      items.push(
        { 
          id: 'nomina', 
          label: esJefe || esAsistenteProg ? 'Nómina Global' : 'Mi Rama', 
          icon: <People />, 
          vista: esJefe || esAsistenteProg ? 'NOMINA_GLOBAL' : 'NOMINA' 
        },
        { id: 'progresion', label: 'Progresión', icon: <BarChart />, vista: 'PROGRESION' },
        { id: 'planificaciones', label: 'Planificaciones', icon: <Assignment />, vista: 'PLANIFICACIONES' }
      );
    }

    // --- Lógica para Asistente Administrativo ---
    if (esJefe || userFuncion === FUNCIONES.ASISTENTE_ADM) {
      items.push({ id: 'finanzas', label: 'Finanzas', icon: <AccountBalanceWallet />, vista: 'FINANZAS' });
    }

    // --- Lógica para Asistente de Comunicaciones ---
    if (esJefe || userFuncion === FUNCIONES.ASISTENTE_COM) {
      items.push({ 
        id: 'noticias', 
        label: 'Panel de noticias', 
        icon: <Campaign />, 
        vista: 'NOTICIAS' // Coincide con el case 'NOTICIAS' en EducadorMainView
      });
    }

    // --- Calendario y Documentos ---
    items.push({ id: 'calendario', label: 'Calendario', icon: <EventIcon />, vista: 'CALENDARIO' });
    
    if (esJefe || esEducadorDeRama || userFuncion === FUNCIONES.ASISTENTE_ADM) {
      items.push({ id: 'documentos', label: 'Fichas Médicas', icon: <FolderShared />, vista: 'DOCUMENTOS' });
    }

    return items;
  }, [userFuncion]);

  const handleSelectRol = (nuevoRol) => {
    onFuncionChange(nuevoRol);
    onRamaChange(Object.keys(COLORES_GESTION).includes(nuevoRol) ? 'TODAS' : nuevoRol.toUpperCase());
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
      
      <BranchSelector 
        open={open} 
        tienePermisoGlobal={tienePermisoGlobal} 
        canChangeRama={canChangeRama} 
        ramaSeleccionada={ramaSeleccionada} 
        onRamaChange={onRamaChange} 
        userFuncion={userFuncion} 
      />
      
      <NavMenu 
        open={open} 
        items={menuItems} 
        vistaActual={vistaActual} 
        setVistaActual={setVistaActual} 
        config={config} 
      />
      
      <UserFooter 
        open={open} 
        userFuncion={userFuncion} 
        config={config} 
        getRoleIcon={getRoleIcon} 
        getCargoLabel={getCargoLabel} 
        onSelectRol={handleSelectRol} 
      />
    </Drawer>
  );
};