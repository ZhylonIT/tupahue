import { ScoutForm } from './ScoutForm';
import { ScoutDetailModal } from './ScoutDetailModal';

export const DashboardModals = ({ state, handleSaveScout }) => {
  return (
    <>
      <ScoutForm 
        open={state.isFormOpen}
        onClose={() => state.setIsFormOpen(false)}
        onSave={handleSaveScout}
        scout={state.scoutSeleccionado}
        ramaId={state.ramaActiva}
        // AGREGAMOS ESTO: Pasamos la lista completa para validar DNI
        scouts={state.scouts} 
      />

      <ScoutDetailModal 
        open={state.isDetailOpen}
        onClose={() => state.setIsDetailOpen(false)}
        scout={state.scoutSeleccionado}
        ramaId={state.ramaActiva}
      />
    </>
  );
};