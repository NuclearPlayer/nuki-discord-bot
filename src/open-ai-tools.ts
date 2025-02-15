import {
  AssistantContent,
  CoreAssistantMessage,
  CoreMessage,
  CoreUserMessage,
  UserContent,
} from 'ai';

export const createUserMessage = ({
  content,
}: {
  content: UserContent;
  name?: string;
}): CoreUserMessage => {
  return {
    role: 'user',
    content,
  };
};

export const createAssistantMessage = ({
  content,
}: {
  content: AssistantContent;
}): CoreAssistantMessage => {
  return {
    role: 'assistant',
    content,
  };
};
