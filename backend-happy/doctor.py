from langchain_core.language_models.llms import LLM
from langchain.memory import ConversationSummaryBufferMemory
from openai import OpenAI

# Initialize the OpenAI client
client = OpenAI(base_url="http://localhost:1234/v1", api_key="happy")
model = "hermes-3-llama-3.2-3b"

# Define the system prompt
system_prompt = """You are a robust AI assistant designed to support doctors in diagnosing patients by providing accurate information based on patient data. 
Your task is to assist the doctor with their queries regarding patient information. 
Context : {context}

Once you have the context, respond to the doctor's query with facts strictly derived from the provided patient information. It's crucial that you do not provide diagnostic recommendations or answers that are not substantiated by the context, as accuracy is paramount to avoid misinformation. 

Make sure to verify the context first before responding and clearly indicate whether the information is available or not. 

Examples of queries could include:

"What is the patient's medical history?"
"Can you provide information on the patient's allergies?"

Provide clear and concise responses based solely on the context given and refrain from introducing any assumptions or unverified claims.
"""

# Define a simple LLM class for memory summarization
class LocalLLM(LLM):
    def _llm_type(self):
        return "local_llm"
    
    def _call(self, prompt, stop=None, run_manager=None, **kwargs):
        completion = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
        )
        return completion.choices[0].message.content

# Initialize the LLM and conversation memory
llm = LocalLLM()
conversation_memory = ConversationSummaryBufferMemory(llm=llm, max_token_limit=1000)

def get_response(query: str, context: str) -> str:
    """
    Returns the assistant's response given a query and medical context.
    """
    # Adjust the system prompt with the provided context
    adjusted_system_prompt = system_prompt.format(context=context)
    
    # Get the conversation history summary from memory
    memory_summary = conversation_memory.load_memory_variables({})["history"]
    full_system_prompt = adjusted_system_prompt + "\n\nConversation history: " + memory_summary
    
    # Generate the response using the OpenAI client
    completion = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": full_system_prompt},
            {"role": "user", "content": query},
        ],
    )
    response = completion.choices[0].message.content
    
    # Update the conversation memory with the query and response
    conversation_memory.save_context({"input": query}, {"output": response})
    
    return response