import { useState, useEffect } from 'react'; // Agregamos useEffect para leer LocalStorage
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, Stack 
} from '@mui/material';
import { Add, Edit, Delete, Campaign } from '@mui/icons-material';
// 👇 Importación relativa correcta según tu estructura
import { NoticiaForm } from './NoticiasForm'; 

export const NoticiasView = () => {
  const [openForm, setOpenForm] = useState(false);
  const [noticiaEdit, setNoticiaEdit] = useState(null);
  
  // 1. Iniciamos el estado con las noticias de LocalStorage o un array vacío
  const [noticias, setNoticias] = useState([]);

  // 2. Función para cargar las noticias desde el LocalStorage
  const cargarNoticias = () => {
    const guardadas = JSON.parse(localStorage.getItem('noticias-tupahue') || '[]');
    setNoticias(guardadas);
  };

  // 3. Efecto para cargar los datos apenas se monta el componente
  useEffect(() => {
    cargarNoticias();
  }, []);

  const handleEdit = (n) => {
    setNoticiaEdit(n);
    setOpenForm(true);
  };

  // 4. Lógica para eliminar una noticia del LocalStorage
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
      const noticiasActuales = JSON.parse(localStorage.getItem('noticias-tupahue') || '[]');
      const filtradas = noticiasActuales.filter(n => n.id !== id);
      localStorage.setItem('noticias-tupahue', JSON.stringify(filtradas));
      cargarNoticias(); // Refrescamos la tabla
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(26, 82, 118, 0.1)', color: '#1a5276' }}>
            <Campaign />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Gestión de Prensa</Typography>
            <Typography variant="body2" color="text.secondary">Publicá las novedades del Grupo Scout Tupahue.</Typography>
          </Box>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => { setNoticiaEdit(null); setOpenForm(true); }}
          sx={{ bgcolor: '#1a5276', borderRadius: 3, fontWeight: 'bold' }}
        >
          Nueva Noticia
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fbfcfd' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Título de la Noticia</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 800 }} align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {noticias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                  No hay noticias cargadas. Hacé clic en "Nueva Noticia" para empezar.
                </TableCell>
              </TableRow>
            ) : (
              noticias.map((n) => (
                <TableRow key={n.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{n.titulo}</TableCell>
                  <TableCell>{n.estado}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton onClick={() => handleEdit(n)} sx={{ color: '#1a5276' }}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(n.id)} sx={{ color: '#c0392b' }}>
                        <Delete />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulario Modal */}
      {openForm && (
        <NoticiaForm 
          open={openForm} 
          onClose={() => setOpenForm(false)} 
          noticiaEdit={noticiaEdit}
          onSave={cargarNoticias} // 5. Le pasamos la función de recarga al modal
        />
      )}
    </Box>
  );
};