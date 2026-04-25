import streamlit as st
import requests
import json

# --- CONFIGURATION ---
# Replace with your actual n8n webhook URL
N8N_WEBHOOK_URL = "https://safir1409.app.n8n.cloud/webhook-test/grade"

st.set_page_config(page_title="Handwritten Grader AI", layout="centered")

st.title("📝 Student Answer Sheet Grader")
st.markdown("Upload the answer_key and student's answer sheet for instant grading.")

# --- INPUT SECTION ---
with st.form("grading_form"):
    student_email = st.text_input("Student Email", placeholder="student@example.com")
    
    col1, col2 = st.columns(2)
    with col1:
        answer_key = st.file_uploader("answer_key", type=['png', 'jpg', 'jpeg','pdf'])
    with col2:
        answer_sheet = st.file_uploader("Answer Sheet", type=['png', 'jpg', 'jpeg','pdf '])
    
    submit_button = st.form_submit_button("Submit for Grading")

# --- PROCESSING SECTION ---
if submit_button:
    if not student_email or not answer_key or not answer_sheet:
        st.error("Please provide the email and both images.")
    else:
        with st.spinner("Analyzing handwriting and grading..."):
            try:
                # Preparing the files for the multipart/form-data request
                files = {
                    "answer_key": (answer_key.name, answer_key.getvalue(), answer_key.type),
                    "answer_sheet": (answer_sheet.name, answer_sheet.getvalue(), answer_sheet.type)
                }
                data = {"email": student_email}
                
                # Sending request to n8n
                response = requests.post(N8N_WEBHOOK_URL, files=files, data=data)
                
                if response.status_code == 200:
                    # n8n returns the list you provided
                    raw_data = response.json()
                    
                    # Accessing the first element of the list
                    grade_data = raw_data[0] if isinstance(raw_data, list) else raw_data
                    
                    st.success("Grading Complete!")
                    
                    # --- OUTPUT DISPLAY ---
                    st.header("Results Summary")
                    
                    # Metric dashboard
                    m1, m2, m3, m4 = st.columns(4)
                    m1.metric("Score", f"{grade_data['marks_scored']}/{grade_data['total_marks']}")
                    m2.metric("Percentage", f"{grade_data['score_percentage']}%")
                    m3.metric("Correct", grade_data['correct'])
                    m4.metric("Wrong", grade_data['wrong'])
                    
                    st.divider()
                    st.subheader("Question Breakdown")
                    
                    for item in grade_data['results']:
                        with st.expander(f"Question #{item['question_number']} - {'✅ Correct' if item['is_correct'] else '❌ Incorrect'}"):
                            st.write(f"**Student's Answer:** {item['student_answer']}")
                            st.write(f"**Correct Answer:** {item['correct_answer']}")
                            st.write(f"**Marks Awarded:** {item['marks_awarded']}")
                else:
                    st.error(f"Error from server: {response.status_code}")
                    
            except Exception as e:
                st.error(f"Connection failed: {str(e)}")