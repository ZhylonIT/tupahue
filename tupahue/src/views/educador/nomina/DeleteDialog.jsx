import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle 
} from '@mui/material';

export const DeleteDialog = ({ open, scout, onClose, onConfirm }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 800 }}>
        ¿Eliminar de la lista?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Estás por eliminar a <strong>{scout?.apellido.toUpperCase()}, {scout?.nombre}</strong>. 
          Esta acción no se puede deshacer y el protagonista ya no aparecerá en esta unidad.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          sx={{ color: 'gray', fontWeight: 700 }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error" 
          sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
        >
          Eliminar permanentemente
        </Button>
      </DialogActions>
    </Dialog>
  );
};