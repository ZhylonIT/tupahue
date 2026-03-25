export const TodoApp = ({ cantidad }) => {
  return (
    <>
      {cantidad > 0
        ? <p>Tienes {cantidad} tareas pendientes</p>
        : <p>Usted no tiene tareas pendientes</p>
      }
    </>
  );
}