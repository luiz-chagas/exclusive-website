export const makeMessageService = () => {
  const messages: string[] = [];

  const addMessage = (text: string) => messages.unshift(text);
  const getMessages = () => messages;

  return {
    addMessage,
    getMessages,
  };
};
