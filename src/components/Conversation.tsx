import { useState, useEffect, useRef} from "react"
import ChatDisplay from "@components/ChatDisplay"
import UserInput from "@components/UserInput"
import { Action, Message, PaymentTerms, Response, ResponseType } from "@/baml_client/types"


  /**
   * This component renders a conversation with the CollectBot AI.
   * It maintains a state of messages that have been sent and received,
   * and renders them in a ChatDisplay component.
   * It also renders a UserInput component that allows the user to send
   * new messages to the AI.
   * When the user sends a message, it fetches a response from the AI
   * and adds it to the state of messages.
   * If the response is a function call, it calls the function and adds
   * the output to the state of messages.
   */
export default function Conversation() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! Our records show that you currently owe $2400. Is this amount correct?" }
  ])

  const [isThinking, setIsThinking] = useState(false);

  const messagesRef = useRef<Message[]>([
    { role: "assistant", content: "Hello! Our records show that you currently owe $2400. Is this amount correct?" }
  ])


  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    if (messages[messages.length - 1].role === "user" || messages[messages.length - 1].role === "function_output") {
      setIsThinking(true);
      (async () => {
        const newMessages = await fetchModelResponse(messagesRef.current)
        if (newMessages) {
          setMessages((prevMessages => [...prevMessages, ...newMessages]))
          setIsThinking(false);
        }
      })()
    }
  }, [messages])

  const getPaymentURL = (terms:PaymentTerms) => {
    return `collectwise.com/payments?termLength=${terms.payment_term_length}
    &totalDebtAmount=${terms.debt_amount}&termPaymentAmount=${terms.payment_amount}`
  }

  const fetchModelResponse = async (messages:Message[]) => {
    console.log(messages)
    const output = await fetch('/api/CollectBot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({messages})
    }).then(res => res.json())
    console.log(output)

    if (output.status !== 200) {
      console.error("Error fetching model response:", output.message)
      return []
    }

    const response:Response = output.data as Response;

    if (response.type == ResponseType.FUNCTION_CALL) {
      const A:Action = response.content as Action
      if (A.function_name === "getPaymentURL") {
        const url = getPaymentURL(A.parameters)
        const functionCallMessage:Message = { role: "function_call", content: JSON.stringify(A)}
        const functionOutputMessage:Message = { role: "function_output", content: url }
        return [functionCallMessage, functionOutputMessage]
      } 
    } else {
      const newMessage:Message = { role: "assistant", content: response.content as string}
      return [newMessage]
    }
  }

  const handleUserMessage = (userMessage: string) => {
    const newMessage = { role: "user", content: userMessage }
    setMessages((prevMessages) => [...prevMessages, newMessage])
  }

  return (
    <>
      <ChatDisplay messages={messages} isThinking={isThinking}/>
      <UserInput sendMessage={handleUserMessage}/>
    </>
  )
}