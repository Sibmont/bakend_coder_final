import { v4 as uuidv4 } from "uuid";
import dataSources from "../dao/managers/factory.js";
import TicketsRepo from "../repositories/tickets.repo.js";

const TicketsDao = new dataSources.tickets();
const ticketsRepo = new TicketsRepo(TicketsDao);

const createTicket = async (purchaser, purchase) => {
  const ticketDate = new Date().toJSON();
  const ticketCode = uuidv4();
  const totalPrice = purchase.amount;

  const ticket = {
    code: ticketCode,
    purchase_datetime: ticketDate,
    amount: totalPrice,
    purchaser,
    status: "PENDING",
  };

  if (purchase.purchased.length > 0) {
    const ticketResult = await ticketsRepo.createTicket(ticket);
    if (purchase.notPurchased.length > 0) {
      const updatedPayload = {
        ...ticketResult.payload._doc,
        "not purchased": purchase.notPurchased,
      };
      return {
        status: "Success",
        message: "Products purchased successfully",
        payload: updatedPayload,
      };
    }
    return ticketResult;
  } else {
    return {
      status: "error",
      message: "Purchase was not successful due to no stock available",
      payload: purchase.notPurchased,
    };
  }
};

const getTickets = async () => {
  const result = await ticketsRepo.getTickets();
  return result;
};

const getTicketById = async (id) => {
  const result = await ticketsRepo.getTicketById(id);
  return result;
};

const resolveTicket = async (ticket, status) => {
  ticket.status = status;
  await ticketsRepo.resolveTicket(ticket);
  return result;
};

export { createTicket, getTicketById, getTickets, resolveTicket };
