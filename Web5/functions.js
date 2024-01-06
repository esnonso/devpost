export const createChatProtocol = async (web5, did, pro, protocolDef) => {
  const { protocols: existingProtocol, status: existingProtocolStatus } =
    await web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: pro,
        },
      },
    });
  if (existingProtocolStatus.code !== 200 || existingProtocol.length === 0) {
    const { protocol, status } = await web5.dwn.protocols.configure({
      message: {
        definition: protocolDef,
      },
    });
    await protocol.send(did);
  } else {
    return;
  }
};

export const fetchSentMessages = async (web5, protocol) => {
  const response = await web5.dwn.records.query({
    message: {
      filter: {
        protocol: protocol,
      },
    },
  });

  if (response.status.code === 200) {
    const sentChats = await Promise.all(
      response.records.map(async (record) => {
        const data = await record.data.json();
        return data;
      })
    );
    return sentChats;
  } else {
    throw new Error("An error occured loading this page");
  }
};

export const fetchReceivedMessages = async (web5, did, protocol, schema) => {
  const response = await web5.dwn.records.query({
    from: did,
    message: {
      filter: {
        protocol: protocol,
        schema: schema,
      },
    },
  });

  if (response.status.code === 200) {
    const receivedMessages = await Promise.all(
      response.records.map(async (record) => {
        const data = await record.data.json();
        return data;
      })
    );
    return receivedMessages;
  } else {
    throw new Error("An error occured loading this page");
  }
};

function compare(a, b) {
  if (a.time < b.time) {
    return -1;
  }
  if (a.time > b.time) {
    return 1;
  }
  return 0;
}

export const sortWeb5Messages = async (sentMessages, receivedMessages, id) => {
  const sent = sentMessages.filter((r) => r.complaintId === id);
  const received = receivedMessages.filter((r) => r.complaintId === id);
  const replies = sent.concat(received);
  const removeDuplicates = replies.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (c) => c.message === value.message && c.time === value.time
      )
  );
  const allReplies = await removeDuplicates.sort(compare);
  return allReplies;
};
