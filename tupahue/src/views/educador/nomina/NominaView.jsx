import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Stack, 
  TextField, TableSortLabel, Chip 
} from '@mui/material';
import { Search, FileDownload, Add, Public, FilterList } from '@mui/icons-material';

// Importación de constantes, utilidades y HOOK
import { RAMAS } from '../../../constants/ramas';
import { exportarNominaOficial } from '../../../utils/excelExport.jsx';
import { useNomina } from './UseNomina.jsx';

// Importación de sub-componentes locales
import { ScoutRow } from './ScoutRow.jsx';
import { DeleteDialog } from './DeleteDialog.jsx';

export const NominaView = ({ 
  scouts = [], 
  onToggleAsistencia, 
  onEdit, 
  onVerFicha, 
  onDelete, 
  onAdd, 
  ramaId = 'CAMINANTES' 
}) => {
  
  // ¡MAGIA! Importamos toda la lógica desde nuestro hook limpio
  const {
    search, setSearch,
    sort, handleRequestSort,
    ramaFilter, setRamaFilter,
    deleteDialog, openDeleteDialog, closeDeleteDialog, confirmDelete,
    esVistaGlobal, CONFIG_RAMA,
    filteredScouts, seleccionados
  } = useNomina(scouts, ramaId, onDelete);

  return (
    <Box sx={{ p: { xs: 2, md: 0 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {esVistaGlobal && <Public sx={{ color: CONFIG_RAMA.color }} />}
            Protagonistas: <span style={{ color: CONFIG_RAMA.color }}>{CONFIG_RAMA.nombre}</span>
          </Typography>
          <Typography variant="body2" color="text.secondary">Tupahue - Grupo 996</Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<FileDownload />} 
            onClick={() => exportarNominaOficial(seleccionados, CONFIG_RAMA, esVistaGlobal)}
            sx={{ borderColor: CONFIG_RAMA.color, color: CONFIG_RAMA.color, borderRadius: 3, fontWeight: 700 }}
          >
            Exportar Nómina ({seleccionados.length})
          </Button>
          {!esVistaGlobal && (
            <Button variant="contained" startIcon={<Add />} onClick={onAdd} sx={{ bgcolor: CONFIG_RAMA.color, borderRadius: 3, fontWeight: 700 }}>
              Nuevo
            </Button>
          )}
        </Stack>
      </Stack>

      <Paper sx={{ p: 1.5, mb: esVistaGlobal ? 2 : 3, display: 'flex', alignItems: 'center', borderRadius: 4, border: '1px solid #eee', boxShadow: 'none' }}>
        <Search sx={{ ml: 1, mr: 1.5, color: 'gray' }} />
        <TextField 
          fullWidth 
          variant="standard" 
          placeholder="Buscar por nombre o DNI..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          InputProps={{ disableUnderline: true }} 
        />
      </Paper>

      {esVistaGlobal && (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ overflowX: 'auto', pb: 1 }}>
            <FilterList sx={{ color: 'text.secondary', mr: 1 }} />
            <Chip 
              label="Ver Todos" 
              onClick={() => setRamaFilter('ALL')} 
              color={ramaFilter === 'ALL' ? 'primary' : 'default'}
              variant={ramaFilter === 'ALL' ? 'filled' : 'outlined'}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            />
            {Object.values(RAMAS).map(r => (
              <Chip 
                key={r.id}
                label={r.nombre} 
                onClick={() => setRamaFilter(r.id)}
                sx={{ 
                  bgcolor: ramaFilter === r.id ? r.color : 'transparent', 
                  color: ramaFilter === r.id ? 'white' : r.color,
                  borderColor: r.color,
                  fontWeight: 700,
                  border: '1px solid',
                  borderRadius: 2
                }}
                variant={ramaFilter === r.id ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </Box>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 5, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fafafa' }}>
            <TableRow>
              <TableCell>
                <TableSortLabel active={sort.orderBy === 'apellido'} direction={sort.order} onClick={() => handleRequestSort('apellido')}>
                  Nombre y Apellido
                </TableSortLabel>
              </TableCell>
              {esVistaGlobal && <TableCell>Rama</TableCell>}
              <TableCell>DNI</TableCell>
              <TableCell>Equipo</TableCell>
              <TableCell align="center">Seleccionar</TableCell>
              <TableCell align="right" sx={{ pr: 3 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredScouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={esVistaGlobal ? 6 : 5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No se encontraron protagonistas con esos filtros.
                </TableCell>
              </TableRow>
            ) : (
              filteredScouts.map(scout => (
                <ScoutRow 
                  key={scout.id} 
                  scout={scout} 
                  esVistaGlobal={esVistaGlobal} 
                  onToggle={() => onToggleAsistencia(scout.id)}
                  onEdit={onEdit}
                  onVer={onVerFicha} 
                  onDelete={() => openDeleteDialog(scout)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', px: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
          Mostrando {filteredScouts.length} {filteredScouts.length === 1 ? 'protagonista' : 'protagonistas'} 
          {(ramaFilter !== 'ALL' || search !== '') && ` de un total de ${scouts.length}`}
        </Typography>
      </Box>

      <DeleteDialog 
        open={deleteDialog.open} 
        scout={deleteDialog.scout} 
        onClose={closeDeleteDialog} 
        onConfirm={confirmDelete} 
      />
    </Box>
  );
};