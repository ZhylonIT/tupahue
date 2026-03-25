import { useState, useMemo } from 'react';
import { RAMAS } from '../../../constants/ramas';

export const useNomina = (scouts, ramaId, onDelete) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ order: 'asc', orderBy: 'apellido' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, scout: null });
  const [ramaFilter, setRamaFilter] = useState('ALL');

  const idBusqueda = ramaId.toUpperCase();
  const esVistaGlobal = idBusqueda === 'TODAS';
  const CONFIG_RAMA = esVistaGlobal 
    ? { nombre: 'Todo el Grupo', color: '#2c3e50' } 
    : (RAMAS[idBusqueda] || RAMAS.CAMINANTES);

  const handleRequestSort = (property) => {
    const isAsc = sort.orderBy === property && sort.order === 'asc';
    setSort({ order: isAsc ? 'desc' : 'asc', orderBy: property });
  };

  // useMemo guarda el resultado para que no se recalcule sin necesidad
  const filteredScouts = useMemo(() => {
    return scouts
      .filter(s => {
        const matchSearch = `${s.nombre} ${s.apellido} ${s.dni}`.toLowerCase().includes(search.toLowerCase());
        const matchRama = ramaFilter === 'ALL' || (s.rama && s.rama.toUpperCase() === ramaFilter);
        return matchSearch && matchRama;
      })
      .sort((a, b) => {
        const isAsc = sort.order === 'asc';
        const valA = (a[sort.orderBy] || "").toString().toLowerCase();
        const valB = (b[sort.orderBy] || "").toString().toLowerCase();
        return (valA < valB ? -1 : 1) * (isAsc ? 1 : -1);
      });
  }, [scouts, search, ramaFilter, sort]);

  const seleccionados = useMemo(() => scouts.filter(s => s.presente), [scouts]);

  // Manejadores del modal de eliminación
  const openDeleteDialog = (scout) => setDeleteDialog({ open: true, scout });
  const closeDeleteDialog = () => setDeleteDialog({ open: false, scout: null });
  const confirmDelete = () => {
    if (deleteDialog.scout) {
      onDelete(deleteDialog.scout.id);
      closeDeleteDialog();
    }
  };

  // Devolvemos todo lo que la vista necesita para dibujarse
  return {
    search, setSearch,
    sort, handleRequestSort,
    ramaFilter, setRamaFilter,
    deleteDialog, openDeleteDialog, closeDeleteDialog, confirmDelete,
    esVistaGlobal, CONFIG_RAMA,
    filteredScouts, seleccionados
  };
};