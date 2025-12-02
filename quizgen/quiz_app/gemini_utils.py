import os
import requests
import json
import logging
from decouple import config

logger = logging.getLogger(__name__)

def generate_quiz_content(topic, difficulty, num_questions):
    """
    Generates quiz content using the Google Gemini API.
    """
    api_key = config('GEMINI_API_KEY', default=None)
    if not api_key:
        logger.error("GEMINI_API_KEY not found in environment variables.")
        return None, "GEMINI_API_KEY not found in environment variables"

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={api_key}"

    prompt = f"""
    Generate a quiz on the topic "{topic}" with {num_questions} questions.
    Difficulty level: {difficulty}.
    
    The output must be a valid JSON object with the following structure:
    {{
        "title": "Quiz Title",
        "questions": [
            {{
                "question_text": "Question 1 text",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option A"
            }}
        ]
    }}
    IMPORTANT: Return ONLY the raw JSON string. Do not include markdown formatting (like ```json ... ```).
    """

    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    headers = {'Content-Type': 'application/json'}

    try:
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code != 200:
            logger.error(f"Gemini API Error: {response.status_code} - {response.text}")
            return None, f"Gemini API Error: {response.status_code}"

        data = response.json()
        
        try:
            text_content = data['candidates'][0]['content']['parts'][0]['text']
            # Clean up potential markdown code blocks if the model ignores the instruction
            text_content = text_content.replace('```json', '').replace('```', '').strip()
            quiz_data = json.loads(text_content)
            return quiz_data, None
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            logger.error(f"Failed to parse Gemini response: {e}")
            logger.error(f"Response data: {data}")
            return None, f"Parse Error: {str(e)}"

    except requests.RequestException as e:
        logger.error(f"Error calling Gemini API: {e}")
        return None, f"Network Error: {str(e)}"

