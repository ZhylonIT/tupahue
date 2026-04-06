import { useState, useMemo } from 'react';
import { Drawer, Box } from '@mui/material';
import { 
  Dashboard, People, BarChart, Event, FolderShared, AccountBalanceWallet, 
  Campaign, AdminPanelSettings, Engineering, School, Assignment, Payments, 
  AccountBalance, WorkspacePremium, RocketLaunch, FamilyRestroom, ReceiptLong, TrendingUp, Groups, EmojiEvents, Description
} from '@mui/icons-material';

import { RAMAS, ROLES_GESTION } from '../../constants/ramas';
import { FUNCIONES, ROLES } from '../../constants/auth';
import { SidebarHeader } from './SidebarHeader';
import { BranchSelector } from './BranchSelector';
import { NavMenu } from './NavMenu';
import { UserFooter } from './UserFooter';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

export const Sidebar = ({ ramaSeleccionada, onRamaChange, vistaActual, setVistaActual, canChangeRama }) => {
  const { user, userFuncion } = useAuth();
  const [open, setOpen] = useState(true);

  // 🎯 MAPEADO DE COLORES DESDE CONSTANTES REALES
  const config = useMemo(() => {
    const mapaColores = {
      [FUNCIONES.JEFE_GRUPO]: ROLES_GESTION.JEFE_GRUPO.color,
      [FUNCIONES.ASISTENTE_PROG]: ROLES_GESTION.PROGRAMA.color,
      [FUNCIONES.ASISTENTE_ADM]: ROLES_GESTION.FINANZAS.color,
      [FUNCIONES.ASISTENTE_COM]: ROLES_GESTION.COMUNICACIONES.color,
      [FUNCIONES.ASISTENTE_ADULTOS]: ROLES_GESTION.ADULTOS.color,
    };

    if (mapaColores[userFuncion]) {
      return { color: mapaColores[userFuncion], fondo: `${mapaColores[userFuncion]}22` };
    }

    if (user?.role === ROLES.FAMILIA) {
      return { color: '#9d4edd', fondo: 'rgba(157, 78, 221, 0.15)' };
    }

    const ramaKey = userFuncion?.replace('PROTAGONISTA_', '') || 'SCOUTS';
    const ramaData = RAMAS[ramaKey] || RAMAS.SCOUTS;
    return { color: ramaData.color, fondo: `${ramaData.color}22` };
  }, [userFuncion, user]);

  const getRoleIcon = (func) => {
    if (func === FUNCIONES.JEFE_GRUPO) return <AdminPanelSettings sx={{ fontSize: 20 }} />;
    if (func?.startsWith('ASISTENTE_')) return <Engineering sx={{ fontSize: 20 }} />;
    if (func?.startsWith('PROTAGONISTA_')) return <Groups sx={{ fontSize: 20 }} />;
    if (func === 'FAMILIA' || user?.role === ROLES.FAMILIA) return <FamilyRestroom sx={{ fontSize: 20 }} />;
    return <School sx={{ fontSize: 20 }} />;
  };

  const getCargoLabel = (func) => {
    if (user?.role === ROLES.FAMILIA) return "Portal de Familia";
    if (func?.startsWith('PROTAGONISTA_')) {
      const ramaKey = func.replace('PROTAGONISTA_', '');
      return `Protagonista ${RAMAS[ramaKey]?.nombre || 'Rama'}`;
    }

    const etiquetas = {
      [FUNCIONES.JEFE_GRUPO]: ROLES_GESTION.JEFE_GRUPO.nombre,
      [FUNCIONES.ASISTENTE_PROG]: ROLES_GESTION.PROGRAMA.nombre,
      [FUNCIONES.ASISTENTE_ADM]: ROLES_GESTION.FINANZAS.nombre,
      [FUNCIONES.ASISTENTE_ADULTOS]: ROLES_GESTION.ADULTOS.nombre,
      [FUNCIONES.ASISTENTE_COM]: ROLES_GESTION.COMUNICACIONES.nombre,
    };

    return etiquetas[func] || `Educador ${RAMAS[func]?.nombre || "Rama"}`;
  };

  const menuItems = useMemo(() => {
    if (user?.role === ROLES.FAMILIA) {
      return [
        { id: 'MIS_HIJOS', label: 'Mis Hijos', icon: <FamilyRestroom />, vista: 'MIS_HIJOS' },
        { id: 'FINANZAS', label: 'Cuotas y Recibos', icon: <ReceiptLong />, vista: 'FINANZAS' },
        { id: 'DOCUMENTACION', label: 'Documentación', icon: <FolderShared />, vista: 'DOCUMENTACION' },
        { id: 'PROGRESION', label: 'Progresión Scout', icon: <TrendingUp />, vista: 'PROGRESION' },
      ];
    }

    if (userFuncion?.startsWith('PROTAGONISTA_')) {
      const ramaId = userFuncion.replace('PROTAGONISTA_', '');
      const items = [
        { id: 'MI_RAMA', label: 'Mi Rama', icon: <Groups />, vista: 'MI_RAMA' },
        { id: 'PROGRESION', label: 'Mi Progresión', icon: <EmojiEvents />, vista: 'PROGRESION' },
        { id: 'PROYECTOS', label: ramaId === 'LOBATOS' ? 'Mi Cacería' : 'Mis Proyectos', icon: <RocketLaunch />, vista: 'PROYECTOS' },
      ];
      if (ramaId === 'ROVERS') {
        items.push(
          { id: 'FINANZAS', label: 'Mis Finanzas', icon: <AccountBalanceWallet />, vista: 'FINANZAS' },
          { id: 'DOCUMENTACION', label: 'Mi Documentación', icon: <Description />, vista: 'DOCUMENTACION' }
        );
      }
      return items;
    }

    const items = [{ id: 'dashboard', label: 'Inicio', icon: <Dashboard />, vista: 'DASHBOARD' }];
    const esJefe = userFuncion === FUNCIONES.JEFE_GRUPO;
    const esAsistenteProg = userFuncion === FUNCIONES.ASISTENTE_PROG;
    const esEducador = [FUNCIONES.LOBATOS, FUNCIONES.SCOUTS, FUNCIONES.CAMINANTES, FUNCIONES.ROVERS].includes(userFuncion);

    if (esJefe || esEducador || esAsistenteProg) {
      items.push(
        { id: 'nomina', label: esJefe || esAsistenteProg ? 'Nómina Global' : 'Mi Rama', icon: <People />, vista: esJefe || esAsistenteProg ? 'NOMINA_GLOBAL' : 'NOMINA' },
        { id: 'progresion', label: 'Progresión', icon: <BarChart />, vista: 'PROGRESION' },
        { id: 'planificaciones', label: 'Planificaciones', icon: <Assignment />, vista: 'PLANIFICACIONES' },
        { id: 'proyectos', label: 'Revisión Proyectos', icon: <RocketLaunch />, vista: 'REVISION_PROYECTOS' }
      );
    }
    if (esJefe || userFuncion === FUNCIONES.ASISTENTE_ADM) items.push({ id: 'finanzas', label: 'Caja del Grupo', icon: <AccountBalanceWallet />, vista: 'FINANZAS' });
    if (esJefe || userFuncion === FUNCIONES.ASISTENTE_COM) items.push({ id: 'noticias', label: 'Panel de Noticias', icon: <Campaign />, vista: 'NOTICIAS' });
    items.push({ id: 'calendario', label: 'Calendario', icon: <Event />, vista: 'CALENDARIO' });
    if (esJefe || esEducador || userFuncion === FUNCIONES.ASISTENTE_ADM) items.push({ id: 'documentos', label: 'Legajos', icon: <FolderShared />, vista: 'DOCUMENTOS' });
    return items;
  }, [userFuncion, user]);

  const handleRoleSwitched = (nuevaFuncion) => {
    if (ROLES_GESTION[nuevaFuncion] || nuevaFuncion === FUNCIONES.JEFE_GRUPO) onRamaChange('TODAS');
    else if (!nuevaFuncion.startsWith('PROTAGONISTA_') && nuevaFuncion !== 'FAMILIA') onRamaChange(nuevaFuncion.toUpperCase());
    setVistaActual(user?.role === ROLES.FAMILIA ? 'MIS_HIJOS' : 'DASHBOARD');
  };

  return (
    <Drawer variant="permanent" sx={{ width: open ? drawerWidth : 70, transition: 'width 0.3s', '& .MuiDrawer-paper': { width: open ? drawerWidth : 70, overflowX: 'hidden', bgcolor: '#121212', color: 'white', borderRight: 'none', boxShadow: '10px 0 30px rgba(0,0,0,0.5)' } }}>
      <SidebarHeader open={open} user={user} config={config} getCargoLabel={getCargoLabel} userFuncion={userFuncion} />
      
      {/* 🎯 SELECTOR OCULTO PARA FAMILIA Y JÓVENES */}
      {user?.role !== ROLES.FAMILIA && user?.role !== ROLES.JOVEN && !userFuncion?.startsWith('PROTAGONISTA_') && (
        <BranchSelector open={open} tienePermisoGlobal={!!ROLES_GESTION[userFuncion]} canChangeRama={canChangeRama} ramaSeleccionada={ramaSeleccionada} onRamaChange={onRamaChange} userFuncion={userFuncion} />
      )}

      <NavMenu open={open} items={menuItems} vistaActual={vistaActual} setVistaActual={setVistaActual} config={config} />
      <UserFooter open={open} userFuncion={userFuncion} config={config} getRoleIcon={getRoleIcon} getCargoLabel={getCargoLabel} onRoleSwitched={handleRoleSwitched} onOpenPerfil={() => alert("Próximamente: Perfil y Firma")} />
    </Drawer>
  );
};