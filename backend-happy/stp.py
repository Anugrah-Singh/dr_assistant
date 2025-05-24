import streamlit as st
import requests

# API Endpoint
API_URL = "http://localhost:8000/"
st.title("Medical Assistant Chatbot")
st.write("This chatbot assists doctors in gathering patient information.")

# Initialize session state for conversation
if "conversation" not in st.session_state:
    st.session_state.conversation = []

# Display chat history
for msg in st.session_state.conversation:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# User input
user_input = st.chat_input("Enter your message...")
if user_input:
    # Add user message to conversation
    st.session_state.conversation.append({"role": "user", "content": user_input})
    
    # Send conversation to API
    response = requests.post(API_URL, json={"conversation": st.session_state.conversation})
    if response.status_code == 200:
        data = response.json()
        assistant_response = data.get("response", "Sorry, something went wrong.")
        
        # Add assistant response to conversation
        st.session_state.conversation.append({"role": "assistant", "content": assistant_response})
        
        # Display messages
        with st.chat_message("assistant"):
            st.write(assistant_response)
    else:
        st.error("Error connecting to the chatbot API.")
