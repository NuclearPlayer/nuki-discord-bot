import { ChatCompletionAssistantMessageParam, ChatCompletionContentPart, ChatCompletionContentPartText, ChatCompletionUserMessageParam } from 'openai/resources';

export const createUserMessage = ({content, name}: {content: Array<ChatCompletionContentPart>, name?: string}): ChatCompletionUserMessageParam => {
  return {
    role: 'user',
    content, 
    name
  }
}

export const createAssistantMessage = ({content}: {content: Array<ChatCompletionContentPartText>}): ChatCompletionAssistantMessageParam => {
  return {
    role: 'assistant',
    content,
    name: 'Nuki'
  }
}