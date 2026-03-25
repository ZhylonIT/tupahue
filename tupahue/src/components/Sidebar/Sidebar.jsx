import { useState, useMemo } from 'react';
import { Drawer } from '@mui/material';
import { 
  Dashboard, People, BarChart, Event as EventIcon, 
  FolderShared, AccountBalanceWallet, Campaign, 
  AdminPanelSettings, Engineering, School,
  Assignment // Icono para Planificaciones
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
    const base = [{ id: 'dashboard', label: 'Inicio', icon: <Dashboard />, vista: 'DASHBOARD' }];
    
    // Vista para Jefe de Grupo
    if (userFuncion === FUNCIONES.JEFE_GRUPO) {
      return [
        ...base, 
        { id: 'nomina_global', label: 'Nómina Global', icon: <People />, vista: 'NOMINA_GLOBAL' }, 
        { id: 'progresion', label: 'Progresión', icon: <BarChart />, vista: 'PROGRESION' }, 
        { id: 'planificaciones', label: 'Planificaciones', icon: <Assignment />, vista: 'PLANIFICACIONES' }, // Agregado aquí también
        { id: 'finanzas', label: 'Finanzas', icon: <AccountBalanceWallet />, vista: 'FINANZAS' }, 
        { id: 'calendario', label: 'Calendario', icon: <EventIcon />, vista: 'CALENDARIO' }, 
        { id: 'noticias', label: 'Comunicaciones', icon: <Campaign />, vista: 'COMUNICACIONES' }
      ];
    }

    // Vista para Asistente Administrativo
    if (userFuncion === FUNCIONES.ASISTENTE_ADM) {
      return [
        ...base, 
        { id: 'finanzas', label: 'Cuotas y Pagos', icon: <AccountBalanceWallet />, vista: 'FINANZAS' }, 
        { id: 'nominas_global', label: 'Nóminas Globales', icon: <People />, vista: 'NOMINA_GLOBAL' }
      ];
    }

    // VISTA PARA EDUCADORES DE RAMA (Default)
    return [
      ...base, 
      { id: 'nomina', label: 'Mi Rama', icon: <People />, vista: 'NOMINA' }, 
      { id: 'progresion', label: 'Progresión', icon: <BarChart />, vista: 'PROGRESION' }, 
      { id: 'planificaciones', label: 'Planificaciones', icon: <Assignment />, vista: 'PLANIFICACIONES' }, // <--- AGREGADO
      { id: 'calendario', label: 'Calendario', icon: <EventIcon />, vista: 'CALENDARIO' }, 
      { id: 'documentos', label: 'Fichas Médicas', icon: <FolderShared />, vista: 'DOCUMENTOS' }
    ];
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