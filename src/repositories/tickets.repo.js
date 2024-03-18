export default class TicketsRepo {
  constructor(dao) {
    this.dao = dao;
  }

  getTickets = async () => {
    const result = await this.dao.getTickets();
    return result;
  };

  getTicketById = async (id) => {
    const result = await this.dao.getTicketById(id);
    return result;
  };

  createTicket = async (ticket) => {
    const result = await this.dao.createTicket(ticket);
    return result;
  };

  resolveTicket = async (ticketResult) => {
    await this.dao.updateTicket(ticketResult._id, ticketResult);
    return ticketResult;
  };
}
