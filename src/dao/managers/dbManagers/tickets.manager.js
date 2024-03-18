import ticketsModel from "./models/tickets.model.js";

export default class dbOrdersManager {
  getTickets = async () => {
    const result = await ticketsModel.find();
    return { status: "Success", payload: result };
  };

  getTicketById = async (id) => {
    const result = await ticketsModel.findById(id);
    return { status: "Success", payload: result };
  };

  createTicket = async (ticket) => {
    const result = await ticketsModel.create(ticket);
    return {
      status: "Success",
      message: "Products purchased successfully",
      payload: result,
    };
  };

  updateTicket = async (id, ticket) => {
    const result = await ticketsModel.findByIdAndUpdate(id, ticket);
    return { status: "Success", payload: result };
  };
}
