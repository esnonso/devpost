export const userProtocolDefinition = {
  protocol: "http://esnonso.com/chat-with-doc-protocol",
  published: true,
  types: {
    chat: {
      schema: "http://esnonso.com/chat-with-doctor-schema",
      dataFormats: ["application/json"],
    },
  },
  structure: {
    chat: {
      $actions: [
        { who: "anyone", can: "write" },
        { who: "author", of: "message", can: "read" },
        { who: "recipient", of: "message", can: "read" },
      ],
    },
  },
};

export const appointmentProtocolDefinition = {
  protocol: "http://esnonso.com/book-appointment-protocol",
  published: true,
  types: {
    appointment: {
      schema: "http://esnonso.com/book-appointment-schema",
      dataFormats: ["application/json"],
    },
  },
  structure: {
    appointment: {
      $actions: [
        { who: "anyone", can: "write" },
        { who: "author", of: "appointment", can: "read" },
        { who: "recipient", of: "appointment", can: "read" },
      ],
    },
  },
};
