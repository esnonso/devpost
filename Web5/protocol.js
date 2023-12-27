export const userProtocolDefinition = {
  protocol: "https://esnonso.com/chat-with-doctor-protocol",
  published: true,
  types: {
    chat: {
      schema: "http://esnonso.com/user/user-chat-schema",
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
