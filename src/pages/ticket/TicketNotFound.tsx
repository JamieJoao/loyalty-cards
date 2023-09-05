interface TicketNotFound {
  message: string
}

export const TicketNotFound = ({ message = 'No se encontró la página' }) => (
  <div className="bc-ticket-not-found bg-overlay flex flex-col justify-center items-center">
    <div className="bc-ticket-not-found__content">
      <h1 className="bc-ticket-not-found__title text-8xl mb-2">404</h1>
      <p className="bc-ticket-not-found__subtitle text-xl">{message}</p>
      <p className="bc-ticket-not-found__subtitle text-xl">Contáctanos para resolver alguna duda</p>
    </div>
  </div>
)
