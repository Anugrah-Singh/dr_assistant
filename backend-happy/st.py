import streamlit as st
import requests
import json

# Page configuration
st.set_page_config(page_title="Medical Chatbot", page_icon="🩺", layout="centered")

# Initialize session state for conversation if not exists
if 'conversation' not in st.session_state:
    st.session_state.conversation = []

# Initialize session state for context
if 'context' not in st.session_state:
    st.session_state.context = ""

# Custom CSS for better styling
st.markdown("""
<style>
.chat-message {
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    max-width: 80%;
    color: #000; /* ensure text is visible */
}
.user-message {
    background-color: #ffffff; /* lighter background for better contrast */
    border: 1px solid #ccc;
    align-self: flex-end;
    margin-left: auto;
}
.assistant-message {
    background-color: #e0eaff; /* slightly darker blue with improved contrast */
    border: 1px solid #99c;
    align-self: flex-start;
}
</style>
""", unsafe_allow_html=True)

# Title and description
st.title("🩺 Medical Chatbot")
st.write("An AI assistant to help doctors with patient information queries.")

# Context input
st.sidebar.header("Patient Context")
st.session_state.context = st.sidebar.text_area(
    "Enter Patient Information", 
    height=300, 
    value=st.session_state.context
)

# Chat input
user_input = st.chat_input("Enter your query...")

# Function to send message to backend
def send_message(user_message):
    try:
        # Prepare payload for backend
        payload = {
            "context": st.session_state.context,
            "conversation": st.session_state.conversation
        }
        
        # Send request to backend
        response = requests.post('http://localhost:8000/chat', json=payload)
        
        if response.status_code == 200:
            data = response.json()
            # Update conversation history
            st.session_state.conversation = data['conversation']
            return data['response']
        else:
            return f"Error: {response.text}"
    
    except requests.exceptions.RequestException as e:
        return f"Network Error: {e}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

# Display existing conversation
def display_conversation():
    for message in st.session_state.conversation:
        if message['role'] == 'user':
            with st.chat_message("user", avatar="👩‍⚕️"):
                st.markdown(f'<div class="chat-message user-message">{message["content"]}</div>', unsafe_allow_html=True)
        elif message['role'] == 'assistant':
            with st.chat_message("assistant", avatar="🤖"):
                st.markdown(f'<div class="chat-message assistant-message">{message["content"]}</div>', unsafe_allow_html=True)

# Display existing conversation
display_conversation()

# Handle user input
if user_input:
    # Display user message
    with st.chat_message("user", avatar="👩‍⚕️"):
        st.markdown(f'<div class="chat-message user-message">{user_input}</div>', unsafe_allow_html=True)
    
    # Add user message to conversation
    st.session_state.conversation.append({
        "role": "user", 
        "content": user_input
    })
    
    # Get AI response
    with st.chat_message("assistant", avatar="🤖"):
        with st.spinner("Generating response..."):
            ai_response = send_message(user_input)
            st.markdown(f'<div class="chat-message assistant-message">{ai_response}</div>', unsafe_allow_html=True)

# Sidebar controls
if st.sidebar.button("Clear Conversation"):
    st.session_state.conversation = []
    st.experimental_rerun()