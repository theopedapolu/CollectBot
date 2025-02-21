import { useState, useEffect, useRef} from "react"
import ChatDisplay from "./ChatDisplay"
import UserInput from "./UserInput"
import { Action, Message, PaymentTerms, Response, ResponseType } from "../baml_client/types"


export default function Conversation() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "..." }])

  const getDebtAmount = async () => {
    const response = await fetch("https://collectwiseapi.com/get-interview-debtor?api_key={vivek}", {
      method:"GET",
      headers: {
        "COLLECTWISE_KEY": "vivek"
      }
    })
    const data = await response.json()
    console.log(data)
    setMessages([{ role: "assistant", content: `Hello! Our records show that you currently owe ${data.debtAmount}. Is this amount correct?` }])
  }

  useEffect(() => {
    getDebtAmount();
  }, [])

  const [isThinking, setIsThinking] = useState(false);

  const messagesRef = useRef<Message[]>([{ role: "assistant", content: "..." }]);


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