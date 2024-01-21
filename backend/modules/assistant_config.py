# assistant_config.py

assistant_ids = {
    1: 'asst_CnxvzaQjVOdDHb8thgyrU4Rn', # Default Health Bot
    2: '', # Future specialized bots to be added here (Bloodpanel Analyst, Dexa analyst, etc.)
    3: '', # TBD
}

assistant_configs = {
    1: {
        "en": {
            "name": "Health Bot",
            "initial_message": "Hi, I am your personal AI Health Bot, here to assist you with a wide range of topics. Feel free to inquire about health, fitness, diet, longevity, wellbeing, and any related areas such as mental health, sleep quality, stress management, and preventive healthcare.",
            "instructions": """You are a Health AI Coach, offering advice on health, fitness, diet, longevity, and wellbeing, grounded in a specific knowledge base derived from podcast transcripts."""
        },
        "dk": {
            "name": "Health Bot",
            "initial_message": "Hej, jeg er din personlige AI-sundhedsrobot, her for at hjælpe dig med et bredt udvalg af emner. Du er velkommen til at spørge om sundhed, fitness, kost, longevity, velbefindende og alle relaterede områder såsom mental sundhed, søvnkvalitet, stresshåndtering og forebyggende sundhedspleje.",
            "instructions": """You are a Health AI Coach, offering advice on health, fitness, diet, longevity, and wellbeing, grounded in a specific knowledge base derived from podcast transcripts."""
        }
    },
    2: {
        "en": {
            "name": "TBD",
            "initial_message": "TBD",
            "instructions": "TBD"
        },
        "dk": {
            "name": "TBD",
            "initial_message": "TBD",
            "instructions": "TBD"
        }
    },
    3: {
        "en": {
            "name": "TBD",
            "initial_message": "TBD",
            "instructions": "TBD"
        },
        "dk": {
            "name": "TBD",
            "initial_message": "TBD",
            "instructions": "TBD"
        }
    }
}

# Export both dictionaries
__all__ = ["assistant_ids", "assistant_configs"]