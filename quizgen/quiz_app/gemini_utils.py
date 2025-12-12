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

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"

    prompt = r"""
    Generate a quiz strictly based on the topic: "{topic}".
    Number of questions: {num_questions}.
    Difficulty level: {difficulty}.
    
    CRITICAL INSTRUCTION:
    If the topic contains specific keywords, years, sub-genres, or specific names (e.g., "Bollywood 2024", "Quantum Physics", "1990s Pop Music"), the questions MUST be specifically about those details. Do NOT generate generic questions about the broad category if more specific details are provided.

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

    IMPORTANT JSON FORMATTING RULES:
    1. Return ONLY the raw JSON string. Do not include markdown formatting (like ```json ... ```).
    2. Properly escape all special characters. For example, use "\\" for a backslash, "\"" for a double quote.
    3. Do NOT use single backslashes for escaping unless it is a standard JSON escape sequence (like \n, \t, \"). 
    """

    payload = {
        "contents": [{
            "parts": [{"text": prompt.format(topic=topic, num_questions=num_questions, difficulty=difficulty)}]
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
            # Clean up potential markdown code blocks
            text_content = text_content.replace('```json', '').replace('```', '').strip()
            
            # Fix invalid escape sequences (e.g., \s, \d, \e not allowed in JSON unless escaped \\s)
            # This regex looks for a backslash that is NOT followed by " / \ b f n r t u
            import re
            text_content = re.sub(r'\\(?![/\\bfnrtu"])', r'\\\\', text_content)

            quiz_data = json.loads(text_content)
            return quiz_data, None
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            logger.error(f"Failed to parse Gemini response: {e}")
            logger.error(f"Response text: {text_content}") # Log the specific text that failed
            return None, f"Parse Error: {str(e)}"

    except requests.RequestException as e:
        logger.error(f"Error calling Gemini API: {e}")
        return None, f"Network Error: {str(e)}"



def generate_quiz_questions(category, title, level, num_questions, additional_instructions=""):
    """
    Generate quiz questions using Gemini API with structured output.
    
    Args:
        category: Quiz category (e.g., "Mathematics", "Science")
        title: Quiz title
        level: Difficulty level ('easy', 'medium', 'hard')
        num_questions: Number of questions to generate
        additional_instructions: Optional additional context
        
    Returns:
        tuple: (list of questions, error_message)
               Each question is a dict with 'text', 'options', 'correct_answer'
    """
    api_key = config('GEMINI_API_KEY', default=None)
    if not api_key:
        logger.error("GEMINI_API_KEY not found in environment variables.")
        return None, "GEMINI_API_KEY not found"

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"

    prompt = f"""Generate {num_questions} multiple-choice questions for a quiz.

Context:
- Category: {category}
- Title: {title}
- Level: {level}
- Constraints: Each question must have EXACTLY 4 options. Mark the correct answer explicitly.
{f'- Additional instructions: {additional_instructions}' if additional_instructions else ''}

Required output format (JSON array):
[
  {{
    "text": "question text here",
    "options": ["option1", "option2", "option3", "option4"],
    "correct_answer": "option1"
  }}
]

CRITICAL RULES:
1. Return ONLY a JSON array, no markdown formatting
2. EXACTLY {num_questions} questions
3. Each question MUST have exactly 4 options
4. correct_answer MUST EXACTLY match one of the 4 options (same string)
5. Keep questions and options concise and clear
6. Do not repeat questions
7. Ensure correct_answer is the exact string from options list
8. Properly escape all JSON special characters
"""

    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    headers = {'Content-Type': 'application/json'}

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        if response.status_code != 200:
            logger.error(f"Gemini API Error: {response.status_code} - {response.text}")
            return None, f"Gemini API Error: {response.status_code}"

        data = response.json()
        
        try:
            text_content = data['candidates'][0]['content']['parts'][0]['text']
            # Clean up markdown code blocks if present
            text_content = text_content.replace('```json', '').replace('```', '').strip()
            
            # Fix invalid escape sequences
            import re
            text_content = re.sub(r'\\(?![/\\\\bfnrtu"])', r'\\\\\\\\', text_content)

            questions = json.loads(text_content)
            
            # Validate the response
            if not isinstance(questions, list):
                return None, "Response is not a list"
            
            if len(questions) != num_questions:
                return None, f"Expected {num_questions} questions, got {len(questions)}"
            
            # Validate each question
            for i, q in enumerate(questions):
                if not all(k in q for k in ['text', 'options', 'correct_answer']):
                    return None, f"Question {i+1} missing required fields"
                
                if not isinstance(q['options'], list) or len(q['options']) != 4:
                    return None, f"Question {i+1} must have exactly 4 options"
                
                if q['correct_answer'] not in q['options']:
                    return None, f"Question {i+1} correct_answer not in options"
            
            logger.info(f"Successfully generated {len(questions)} questions")
            return questions, None
            
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            logger.error(f"Failed to parse Gemini response: {e}")
            logger.error(f"Response text: {text_content[:500]}")
            return None, f"Parse Error: {str(e)}"

    except requests.RequestException as e:
        logger.error(f"Error calling Gemini API: {e}")
        return None, f"Network Error: {str(e)}"
